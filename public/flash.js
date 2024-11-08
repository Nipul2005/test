let eye=document.querySelectorAll('.eye');
let sign=document.querySelector('#form_reg');
let popup=document.querySelector('#flashText');
let popmessage=document.querySelector('#flashMessage')
const password=document.querySelector('#signUpPassword')
const password2=document.querySelector('#in_password')
let signIn=document.querySelector('#sign_in');
let signUp=document.querySelector('#sign_up');
let OpenForm=document.querySelectorAll('.signUp');
let flag=true;



function openform(){
      sign.classList.remove('hidden')
}

    

  eye.forEach((val, id)=>{
    val.addEventListener('click', ()=>{
      if(id == 0){
        if(flag) {
                  flag=false;
                  password2.type='text';
                  val.classList.remove("fa-eye-slash");
                  val.classList.add("fa-eye");
                }else{
                  password2.type='password';
                  flag=true;
                  val.classList.remove("fa-eye");
                  val.classList.add("fa-eye-slash");
                }
      }else{
        if(flag) {
              flag=false;
              password.type='text';
              val.classList.remove("fa-eye-slash");
              val.classList.add("fa-eye");
            }else{
              password.type='password';
              flag=true;
              val.classList.remove("fa-eye");
              val.classList.add("fa-eye-slash");
            }
      }
    })
  })
  
function closeForm() {
    sign.classList.add('hidden');
  }
  

function showSignIn() {
    document.getElementById('signInForm').classList.remove('hidden');
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('signInTab').classList.add('bg-indigo-500');
    document.getElementById('signInTab').classList.add('text-white');
    document.getElementById('signUpTab').classList.remove('text-white');
    document.getElementById('signUpTab').classList.remove('bg-indigo-500');
    document.getElementById('signUpTab').classList.add('text-indigo-400');
}


function showSignUp() {
    document.getElementById('signUpTab').classList.add('bg-indigo-500');
    document.getElementById('signUpTab').classList.add('text-white');
    document.getElementById('signInTab').classList.remove('bg-indigo-500');
    document.getElementById('signInTab').classList.add('bg-indigo-50');
    document.getElementById('signUpForm').classList.remove('hidden');
    document.getElementById('signInForm').classList.add('hidden');
    document.getElementById('signInTab').classList.add('text-indigo-400');
    document.getElementById('signInTab').classList.remove('text-white');
  }

  signIn.addEventListener("submit" , async(e)=>{
    e.preventDefault();
    const email= document.querySelector('#in_email').value;
    const password= document.querySelector('#in_password').value;
    
    if(!email || !password) return show_normal("Please fill all required field");

    const response= await fetch('/signin', {
      method:'POST',
      headers:{
        'Content-type': 'application/json',
      },
      body: JSON.stringify({email, password})
    })

    const final=await response.json();
    
    if(final.message ==401){
      show('Something went wrong')
    }else{
      show_normal("Page Loading...");
      popmessage.style.animationIterationCount = 10;
      setTimeout(()=>{
        window.location.href='/Home';
      },2000);
    }
  })


  signUp.addEventListener('submit', async(e)=>{
    
    e.preventDefault()
    const name=document.querySelector('#signUpName').value;
    const email=document.querySelector('#signUpEmail').value;
    const password=document.querySelector('#signUpPassword').value;
  
    if(name =="" || email== "" || password =="") {return show_normal("Fill the all requirements")}
  
      const response= await fetch('/signup', {
        method: 'POST',
        headers:{
          'Content-type': 'application/json'
        },
  
        body: JSON.stringify({name, email, password})
      })
  
      const final= await response.json();
      if(final.message ==200){
          show_normal("Page Loading...");
          popmessage.style.animationIterationCount = 10;
          setTimeout(()=>{
            window.location.href='/Home';
          },2000);
      }else if(final.message == 300){
        show_normal("Already exist, please login ")
        showSignIn();
      }else{
        show_normal("Something went wrong");
      }
  })


  function show(value){
    popup.innerText=value;
  
      popmessage.classList.add('bouces')
      
      setTimeout(()=>{
        popmessage.classList.remove('bouces')
       }, 2000)
       showSignUp()
  
  }
  
  function show_normal(value){
    popup.innerText=value;
  
    popmessage.classList.add('bouces')
      
      setTimeout(()=>{
        popmessage.classList.remove('bouces')
       }, 2000)
  }
  
  