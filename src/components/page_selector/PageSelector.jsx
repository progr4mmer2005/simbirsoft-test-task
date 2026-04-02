import { useEffect, useState } from "react";
import "./PageSelector.css";

export default function PageSelector({ currentPage, totalPages, visiblePagesCount, setPage }) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        function onResize() {
            setScreenWidth(window.innerWidth);
        }

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    function getPagesToRender(current, total, maxVisible) {
        if (maxVisible <= 3) {
            const pages = [];
            if (current > 1) pages.push(current - 1);
            pages.push(current);
            if (current < total) pages.push(current + 1);
            return pages;
        }

        if (total <= maxVisible) {
            const pages = [];
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
            return pages;
        }

        const pages = [];
      

        if (current <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('...');
            pages.push(total);
        } else if (current > total - 4) {
            pages.push(1);
            pages.push('...');
            for (let i = total - 4; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            pages.push(current - 1);
            pages.push(current);
            pages.push(current + 1);
            pages.push('...');
            pages.push(total);
        }
        return pages;
    }

    let maxVisible = visiblePagesCount;
    if (screenWidth <= 600) {
        maxVisible = 3;
    }
    const pagesToRender = getPagesToRender(currentPage, totalPages, maxVisible);

    return (
        <nav className="page-selector" aria-label="Пагинация">
            <button
                className="page-arrow"
                onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Предыдущая страница"
            >
                ‹
            </button>

            <div className="page-numbers">
                {pagesToRender.map((item, index) => (
                    <button
                        key={`${item}-${index}`}
                        className={`page-item ${item === currentPage ? 'active' : ''} ${item === '...' ? 'dots' : ''}`}
                        onClick={() => typeof item === 'number' && setPage(item)}
                        disabled={item === '...'}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <button
                className="page-arrow"
                onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Следующая страница"
            >
                ›
            </button>
        </nav>
    );
}
