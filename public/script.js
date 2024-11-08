let sign=document.querySelector('#form_reg');

let popup=document.querySelector('#flashText');
let popmessage=document.querySelector('#flashMessage')
let postbtn=document.querySelector('#postbtn');
let post=document.querySelector('#postform');
let postclose=document.querySelector('#postclose');
let postsbm=document.querySelector('#post_form');
let dyne=document.querySelector('#ins2');

postbtn.addEventListener('click', ()=>{
  post.classList.toggle('hidden')
})

function closeform(){
  post.classList.add('hidden');
}



function showLoader(){
  let loader=document.querySelector('#loader').classList.remove('hidden')
}

function hideLoader(){
  let loader=document.querySelector('#loader').classList.add('hidden')
}


function show_normal(value){
  popup.innerText=value;

  popmessage.classList.add('bouces')
    
    setTimeout(()=>{
      popmessage.classList.remove('bouces')
     }, 2000)
}

postsbm.addEventListener('submit', async(e)=>{
  e.preventDefault()
  let dscription=document.querySelector('#description').value;
  let fileInput=document.querySelector('#file-upload');

  const file = fileInput.files[0]; // Get the file from the input
    // Create a FormData object

    const formData = new FormData();

    formData.append('description', dscription); // Append the description
    if (file) {
        formData.append('attachment', file); // Append the file if it exists
    }

  const response=await fetch('/posts', {
    method: "POST",
    body: formData
  })

    const final=await response.json();
    let postimg=document.querySelector('#postimg');
    if(final.code ==200){
      show_normal(final.message);
      closeform()
    }else{
      show_normal(final.message);
      closeform()
    }
    
})

let  clutter=null;

async function showpost(){
    const response=await fetch('/posting');
    const final=await response.json();
    final.allpost.forEach(async (val)=>{
    clutter +=`
          <div class="post-card bg-white shadow-md rounded-lg p-6 mb-8">
                <div class="flex items-center mb-6">
                    <img class="w-8 h-8 rounded-full mr-2" src="https://via.placeholder.com/50" alt="User profile">
                    <div class="text-sm">
                        <p class="text-gray-900 text-xl ">John Doe</p>
                    </div>
                </div>
                <p class="text-gray-800 mb-4">
                   ${val.content};
                </p>
                <img class="w-full h-48 object-cover rounded-md mb-4" src="${val.path}"
                    alt="Post Image" id="postimg">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <button class="text-gray-600 hover:text-indigo-700 mr-4" aria-label="Like this post">
                            <i class="fas fa-heart"></i> Like
                        </button>
                        <button class="text-gray-600 hover:text-indigo-700 comment-toggle mr-4" aria-label="Comment on this post">
                            <i class="fas fa-comment"></i> Comment
                        </button>
                    </div>
                    <span class="text-gray-500 text-sm">5 minutes ago</span>
                </div>
                <!-- Comment Box -->
                <div class="comment-box mt-4">
                    <div class="flex items-center mb-4 ">
                        <img class="w-10 h-10 rounded-full mr-2" src="https://via.placeholder.com/50" alt="User profile">
                        <input type="text" class="border rounded-lg p-2 w-full" placeholder="Add a comment...">
                        <button class="text-indigo-500 hover:text-indigo-700 ml-2" aria-label="Submit comment">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
      `

      
        dyne.innerHTML=clutter;
    })
}

// document.addEventListener('DOMContentLoaded', showpost)
// window.document.addEventListener('loadedmetadata',showpost)

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('DOMContentLoaded event triggered');
//   showpost();
// });

window.onload=showpost