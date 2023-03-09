async function handleSignup(e) {
  try {
    e.preventDefault();

    const name = document.getElementById("full-name").value;
    const userName = document.getElementById("user-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    const { data } = await axios({
      method: "post",
      url: "/api/v1/users/signup",
      data: { name, userName, email, password, passwordConfirm },
    });

    setTimeout(() => {
      location.assign("/");
    }, 2000);
  } catch (err) {
    console.log(err.response.data);
  }
}

export default handleSignup;
