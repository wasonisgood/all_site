// script.js

// 將文獻數據顯示在網頁上
function displayLiterature(data) {
    const literatureList = document.getElementById('literature-list');

    data.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'literature-item';

        const title = document.createElement('div');
        title.className = 'literature-title';
        title.textContent = entry.bib.title || 'No Title';

        const authors = document.createElement('div');
        authors.className = 'literature-authors';
        authors.textContent = entry.bib.author ? entry.bib.author.join(', ') : 'Unknown Authors';

        const journal = document.createElement('div');
        journal.className = 'literature-journal';
        journal.textContent = entry.bib.venue || 'No Journal';

        const details = document.createElement('div');
        details.className = 'literature-details';
        details.textContent = `Year: ${entry.bib.pub_year || 'n.d.'}, Citations: ${entry.num_citations || '0'}`;

        const links = document.createElement('div');
        links.className = 'literature-links';

        // 原始文獻連結
        if (entry.pub_url) {
            const pubLink = document.createElement('a');
            pubLink.href = entry.pub_url;
            pubLink.target = '_blank';
            pubLink.textContent = 'Original Publication';
            links.appendChild(pubLink);
        }

        // 電子出版連結
        if (entry.eprint_url) {
            const eprintLink = document.createElement('a');
            eprintLink.href = entry.eprint_url;
            eprintLink.target = '_blank';
            eprintLink.textContent = 'Full Text (ePrint)';
            links.appendChild(eprintLink);
        }

        item.appendChild(title);
        item.appendChild(authors);
        item.appendChild(journal);
        item.appendChild(details);
        item.appendChild(links);
        literatureList.appendChild(item);
    });
}

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    displayLiterature(literatureData);
});
