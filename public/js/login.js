export async function handleLogin(e) {
  try {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    document.querySelector(".btn-loginnow").textContent = "Loging In ...";

    const { data } = await axios({
      method: "post",
      url: "/api/v1/users/login",
      data: { email, password },
    });

    setTimeout(() => {
      location.assign("/");
    }, 2000);
  } catch (err) {
    console.log(err);
  }
}

export async function handleLogout(e) {
  try {
    e.preventDefault();
    e.target.textContent = "Loging out...";
    await axios({ method: "get", url: "/api/v1/users/logout" });

    setTimeout(() => {
      location.assign("/");
    }, 2000);
  } catch (err) {
    console.log(err.response.data);
  }
}
