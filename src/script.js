// Função para contar as tags HTML
    async function countTags() {
        const url = document.getElementById('urlInput').value;
        try{
            
            const response = await fetch('http://localhost:3000/tags', {
                method: 'POST',
                headers:{ 'Content-Type': 'application/json'},
                body: JSON.stringify({urls: url})
            })

            const tagCounts = await response.json;
                    
            const tbodyEl = document.getElementById('tbody-id');
            tbodyEl.innerHTML = '';

            for(const tagIterator in tagCounts){
                const line = document.createElement('tr');
                const tagName = document.createElement('td');
                const tagQuantity = document.createElement('td');

                tagName.textContent = tag;
                tagQuantity.textContent = qtde[tag];

                line.appendChild(tagName);
                line.appendChild(tagQuantity);
                tbodyEl.append(line);

            }
            
        }

        catch(error){
            console.log("Falha na requisição dos dados");
        }

    }

    const btnCount = document.getElementById('btn-count');
    btnCount.onclick = countTags;