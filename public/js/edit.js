const projectId = document.querySelector('#blogpost-id').value;

const editFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#blogpost-name').value.trim();
  const description = document.querySelector('#blogpost-desc').value.trim();

  console.log(projectId);

  if (name && description) {
    const response = await fetch(`/api/blogpost/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      console.log(response);
    }
  }
};

document.querySelector('.edit').addEventListener('click', editFormHandler);
