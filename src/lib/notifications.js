/**
 * Notification Helper Functions
 *
 * Unified notification system that:
 * 1. Creates notification in database
 * 2. Sends push notification via FCM
 * 3. (Future) Broadcasts via Socket.io for real-time updates
 *
 * Use these functions throughout the app to trigger notifications.
 */

import Notification from "@/models/Notification";
import User from "@/models/User";
import { sendPushNotification, sendBatchPushNotifications } from "@/lib/firebase/admin";

/**
 * Send a notification to a single user
 *
 * @param {Object} options - Notification options
 * @param {string} options.recipientId - User ID to send notification to
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type (system/admin/info/warning/success/error)
 * @param {string} options.senderId - User ID of sender (null for system)
 * @param {string} options.actionUrl - URL to navigate to on click (optional)
 * @param {string} options.actionLabel - Button label for action (optional)
 * @param {Object} options.metadata - Additional data (optional)
 * @param {Date} options.expiresAt - Expiration date (optional)
 * @returns {Promise<Object>} Created notification and delivery status
 */
export const sendNotification = async ({
    recipientId,
    title,
    message,
    type = "info",
    senderId = null,
    actionUrl = null,
    actionLabel = null,
    metadata = {},
    expiresAt = null,
}) => {
    try {
        // 1. Create notification in database
        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            title,
            message,
            actionUrl,
            actionLabel,
            metadata,
            expiresAt,
            deliveryStatus: {
                socketDelivered: false,
                pushDelivered: false,
            },
        });

        // 2. Get user's FCM tokens
        const user = await User.findById(recipientId);
        if (!user) {
            console.error("❌ User not found:", recipientId);
            return { notification, pushSent: false };
        }

        // Check if user has push notifications enabled
        if (!user.preferences?.pushNotifications) {
            console.log("ℹ️ User has push notifications disabled");
            return { notification, pushSent: false };
        }

        const fcmTokens = user.getActiveFcmTokens();

        if (fcmTokens.length === 0) {
            console.log("ℹ️ No FCM tokens found for user");
            return { notification, pushSent: false };
        }

        // 3. Send push notification to all user's devices
        const pushPromises = fcmTokens.map((token) =>
            sendPushNotification(token, {
                title,
                body: message,
                data: {
                    notificationId: notification._id.toString(),
                    actionUrl: actionUrl || "/notifications",
                    type,
                },
            }).catch((error) => {
                console.error(
                    `❌ Failed to send push to token: ${token.substring(0, 20)}...`,
                    error.message
                );
                return null;
            })
        );

        const pushResults = await Promise.allSettled(pushPromises);
        const successCount = pushResults.filter((r) => r.status === "fulfilled" && r.value).length;

        // Update notification delivery status
        if (successCount > 0) {
            await notification.markPushDelivered();
        } else {
            await notification.markPushDelivered("All push attempts failed");
        }

        console.log(
            `✅ Notification sent to user ${recipientId}: ${successCount}/${fcmTokens.length} push delivered`
        );

        return {
            notification,
            pushSent: successCount > 0,
            pushCount: successCount,
            totalTokens: fcmTokens.length,
        };
    } catch (error) {
        console.error("❌ Error sending notification:", error);
        throw error;
    }
};

/**
 * Send notification to multiple users
 *
 * @param {Object} options - Notification options
 * @param {Array<string>} options.recipientIds - Array of user IDs
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type
 * @param {string} options.senderId - User ID of sender
 * @param {string} options.actionUrl - URL to navigate to on click (optional)
 * @param {string} options.actionLabel - Button label for action (optional)
 * @returns {Promise<Object>} Delivery summary
 */
export const sendBulkNotification = async ({
    recipientIds,
    title,
    message,
    type = "info",
    senderId = null,
    actionUrl = null,
    actionLabel = null,
}) => {
    try {
        const results = {
            total: recipientIds.length,
            created: 0,
            pushSent: 0,
            errors: [],
        };

        // Send to each user
        for (const recipientId of recipientIds) {
            try {
                const result = await sendNotification({
                    recipientId,
                    title,
                    message,
                    type,
                    senderId,
                    actionUrl,
                    actionLabel,
                });

                results.created++;
                if (result.pushSent) {
                    results.pushSent++;
                }
            } catch (error) {
                results.errors.push({
                    recipientId,
                    error: error.message,
                });
            }
        }

        console.log(
            `✅ Bulk notification sent: ${results.created}/${results.total} created, ${results.pushSent} push delivered`
        );

        return results;
    } catch (error) {
        console.error("❌ Error sending bulk notification:", error);
        throw error;
    }
};

/**
 * Send notification to all users (broadcast)
 *
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type
 * @param {string} options.senderId - User ID of sender
 * @param {Object} options.filters - User filters (role, status, etc.)
 * @returns {Promise<Object>} Delivery summary
 */
export const broadcastNotification = async ({
    title,
    message,
    type = "info",
    senderId = null,
    filters = {},
}) => {
    try {
        // Build query based on filters
        const query = { status: "active" }; // Only send to active users

        if (filters.role) {
            query.role = filters.role;
        }

        // Get all matching users
        const users = await User.find(query).select("_id");
        const recipientIds = users.map((u) => u._id.toString());

        console.log(`📢 Broadcasting to ${recipientIds.length} users`);

        // Use bulk send
        return await sendBulkNotification({
            recipientIds,
            title,
            message,
            type,
            senderId,
        });
    } catch (error) {
        console.error("❌ Error broadcasting notification:", error);
        throw error;
    }
};

/**
 * System notification templates
 * Pre-defined notifications for common events
 */

export const notifyUserCreated = async (newUserId, createdByUserId) => {
    const user = await User.findById(newUserId);
    const createdBy = await User.findById(createdByUserId);

    if (!user || !createdBy) return;

    return await sendNotification({
        recipientId: newUserId,
        title: "Welcome to LogaTech Panel!",
        message: `Your account has been created by ${createdBy.name}. You can now log in and start using the platform.`,
        type: "success",
        senderId: createdByUserId,
        actionUrl: "/login",
        actionLabel: "Log In",
    });
};

export const notifyUserStatusChanged = async (userId, oldStatus, newStatus, changedByUserId) => {
    const changedBy = await User.findById(changedByUserId);
    if (!changedBy) return;

    const messages = {
        active: "Your account has been activated and you can now access the platform.",
        inactive: "Your account has been deactivated. Contact support if you have questions.",
        suspended: "Your account has been suspended. Please contact support for more information.",
    };

    return await sendNotification({
        recipientId: userId,
        title: "Account Status Changed",
        message:
            messages[newStatus] ||
            `Your account status has been changed from ${oldStatus} to ${newStatus}.`,
        type: newStatus === "active" ? "success" : "warning",
        senderId: changedByUserId,
    });
};

export const notifyUserRoleChanged = async (userId, oldRole, newRole, changedByUserId) => {
    const changedBy = await User.findById(changedByUserId);
    if (!changedBy) return;

    return await sendNotification({
        recipientId: userId,
        title: "Role Updated",
        message: `Your role has been changed from ${oldRole} to ${newRole} by ${changedBy.name}.`,
        type: "info",
        senderId: changedByUserId,
    });
};

export const notifySystemMaintenance = async (scheduledAt, duration) => {
    return await broadcastNotification({
        title: "Scheduled Maintenance",
        message: `System maintenance is scheduled for ${scheduledAt}. Expected downtime: ${duration} minutes.`,
        type: "warning",
        senderId: null,
    });
};

export const notifySystemAnnouncement = async (title, message, senderId) => {
    return await broadcastNotification({
        title,
        message,
        type: "info",
        senderId,
    });
};
