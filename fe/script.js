function submitData() {
    const name = document.getElementById('nameInput').value;
  
    fetch('api/submit', { // 'backend' = service name di docker-compose
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  