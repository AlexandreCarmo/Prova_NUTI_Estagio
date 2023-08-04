async function countTags() {
    const url = document.getElementById('urlInput').value;
    try {
      const response = await fetch('http://localhost:3000/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: url }),
      });
  
      if (response.status === 200) {
        const tagCounts = await response.json();
  
        const tbodyEl = document.getElementById('tbody-id');
        tbodyEl.innerHTML = '';
  
        for (const tagName in tagCounts) {
          const line = document.createElement('tr');
          const tagNameCell = document.createElement('td');
          const tagQuantityCell = document.createElement('td');
  
          tagNameCell.textContent = tagName;
          tagQuantityCell.textContent = tagCounts[tagName];
  
          line.appendChild(tagNameCell);
          line.appendChild(tagQuantityCell);
          tbodyEl.appendChild(line);
        }
      } else {
        console.log('Falha na requisição dos dados');
      }
    } catch (error) {
      console.log('Falha na requisição dos dados');
    }
  }
  
  const btnCount = document.getElementById('btn-count');
  btnCount.onclick = countTags;
  