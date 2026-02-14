'use client';

import { useState, useEffect } from 'react';
import { 
    X, 
    Download, 
    Copy, 
    Trash2, 
    Edit2, 
    Check, 
    Image as ImageIcon,
    File,
    Film,
    Calendar,
    HardDrive,
    Type
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ImageEditor } from './ImageEditor';

export const MediaDetailsModal = ({ 
    isOpen, 
    onClose, 
    mediaItem, 
    onUpdate, 
    onDelete 
}) => {
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [metadata, setMetadata] = useState({
        alt: '',
        caption: '',
        tags: '',
        originalName: '',
        folder: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (mediaItem) {
            setMetadata({
                alt: mediaItem.alt || '',
                caption: mediaItem.caption || '',
                tags: mediaItem.tags?.join(', ') || '',
                originalName: mediaItem.originalName || '',
                folder: mediaItem.folder || 'general'
            });
        }
    }, [mediaItem]);

    if (!mediaItem) return null;

    const handleSaveMetadata = async () => {
        setIsSaving(true);
        try {
            const { data } = await axios.patch(`/api/media/${mediaItem._id}`, {
                ...metadata,
                tags: metadata.tags.split(',').map(t => t.trim()).filter(Boolean)
            });
            if (data.success) {
                toast.success('Media updated successfully');
                if (onUpdate) onUpdate(data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveImage = async (blob) => {
        // Upload the new image
        const formData = new FormData();
        formData.append('file', blob, `edited-${mediaItem.originalName}`);
        formData.append('folder', mediaItem.folder);
        
        try {
            const { data } = await axios.post('/api/media', formData);
            if (data.success) {
                toast.success('Image saved as new file');
                if (onUpdate) onUpdate(data.data); // Actually this might add a new item, we might want to refresh the list
                setIsEditingImage(false);
                onClose(); // Close details to show the list? Or maybe switch to new item?
                // Let's close for now
            }
        } catch (error) {
            toast.error('Failed to save edited image');
        }
    };

    const handleDelete = async () => {
         if (!confirm('Are you sure you want to delete this file?')) return;
         
         setIsDeleting(true);
         try {
             await axios.delete(`/api/media/${mediaItem._id}`);
             toast.success('Media deleted');
             if (onDelete) onDelete(mediaItem._id);
             onClose();
         } catch (error) {
             toast.error('Delete failed');
         } finally {
             setIsDeleting(false);
         }
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(mediaItem.url);
        toast.success('URL copied');
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        if (!bytes) return 'Unknown';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            {isEditingImage && (
                <ImageEditor 
                    imageSrc={mediaItem.url} 
                    onSave={handleSaveImage} 
                    onCancel={() => setIsEditingImage(false)} 
                />
            )}

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Attachment Details"
                size="xl"
                className="overflow-hidden"
            >
                <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                    {/* Media Preview (Left) */}
                    <div className="md:w-2/3 bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center p-6 border-r border-gray-200 dark:border-gray-700">
                        {mediaItem.mimeType.startsWith('image/') ? (
                            <img 
                                src={mediaItem.url} 
                                alt={mediaItem.alt || mediaItem.originalName} 
                                className="max-w-full max-h-[400px] object-contain shadow-sm"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <File size={64} />
                                <span className="mt-4 text-sm">{mediaItem.mimeType}</span>
                            </div>
                        )}
                    </div>

                    {/* Meta Sidebar (Right) */}
                    <div className="md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
                        
                        {/* File Info */}
                        <div className="space-y-3 text-sm text-gray-500">
                            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="font-medium text-gray-700 dark:text-gray-300">File name:</span>
                                <span className="truncate max-w-[150px]" title={mediaItem.originalName}>{mediaItem.originalName}</span>
                            </div>
                             <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="font-medium text-gray-700 dark:text-gray-300">File type:</span>
                                <span>{mediaItem.mimeType}</span>
                            </div>
                             <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="font-medium text-gray-700 dark:text-gray-300">File size:</span>
                                <span>{formatSize(mediaItem.size)}</span>
                            </div>
                             <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Uploaded on:</span>
                                <span>{new Date(mediaItem.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Metadata Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Alt Text</label>
                                <input 
                                    type="text" 
                                    value={metadata.alt}
                                    onChange={(e) => setMetadata({...metadata, alt: e.target.value})}
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Describe the image for SEO"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Used for accessibility and SEO.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Caption</label>
                                <textarea 
                                    value={metadata.caption}
                                    onChange={(e) => setMetadata({...metadata, caption: e.target.value})}
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20 transition-all"
                                    placeholder="Caption for this file"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="grid grid-cols-2 gap-2">
                                {mediaItem.mimeType.startsWith('image/') && (
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => setIsEditingImage(true)}
                                        className="w-full !justify-center"
                                    >
                                        <Edit2 size={14} className="mr-2" /> Edit Image
                                    </Button>
                                )}
                                <Button 
                                    onClick={handleSaveMetadata}
                                    loading={isSaving}
                                    className="w-full !justify-center"
                                >
                                    Save Meta
                                </Button>
                            </div>
                            
                            <div className="flex gap-2 justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button 
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-600 text-sm flex items-center transition-colors hover:underline"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : <><Trash2 size={14} className="mr-1" /> Delete permanently</>}
                                </button>
                                <div className="flex gap-2">
                                     <button 
                                        onClick={copyUrl}
                                        className="text-blue-500 hover:text-blue-600 text-sm flex items-center transition-colors hover:underline"
                                    >
                                        <Copy size={14} className="mr-1" /> Copy URL
                                    </button>
                                     <a 
                                        href={mediaItem.url}
                                        download
                                        className="text-blue-500 hover:text-blue-600 text-sm flex items-center transition-colors hover:underline"
                                    >
                                        <Download size={14} className="mr-1" /> Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
