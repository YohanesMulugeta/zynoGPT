async function handleLogin(e) {
  try {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data } = await axios({
      method: "post",
      url: "/api/v1/users/login",
      data: { email, password },
    });

    console.log({ data });

    setTimeout(() => {
      location.assign("/");
    }, 2000);
  } catch (err) {
    console.log(err.response.data);
  }
}

export default handleLogin;
