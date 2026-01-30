/**
 * Footer - Simple footer component for website pages
 */
export default function WebsiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">Loga Tech</div>
                <div className="footer-tagline">Design · Develop · Deploy · Maintain</div>
                <div className="copyright">© 2019-{currentYear} Loga Tech. All Rights Reserved.</div>
            </div>
        </footer>
    );
}
