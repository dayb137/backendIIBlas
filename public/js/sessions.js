const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const output = document.getElementById("output");

const mostrarResultados = (data) =>{
    output.textContent = JSON.stringify(data, null, 2)
};

const getToken= () => localStorage.getItem("token")

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(registerForm).entries());
    try {
        const res = await fetch(`/api/sessions/register`, {
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });
        mostrarResultados(await res.json());

    } catch (error) {
        mostrarResultados({ error: error.message})
        
    };
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(loginForm).entries());
    try {
        const res = await fetch(`/api/sessions/login`, {
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        mostrarResultados(data);
        

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
    } catch (error) {
        mostrarResultados({ error: error.message});
        
    };
});

logoutBtn.addEventListener("click", async ()=>{
    try {
        const res = await fetch("/api/sessions/logout", {
            method:"GET"
        });
        const data = await res.json();
        mostrarResultados(data);

        localStorage.removeItem("token");

    } catch (error) {
        mostrarResultados({ error: error.message});
    }
})



const getUsers = async () => {
    try {
        const res = await fetch("/api/sessions/users", {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });

        mostrarResultados(await res.json());

    } catch (error) { mostrarResultados({ error: error.message }); }
};

const updateUser = async (userId, updateData) => {
    try {
        const res = await fetch(`/api/sessions/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(updateData)
        });
        mostrarResultados(await res.json());
    } catch (error) { mostrarResultados({ error: error.message }); }
};

const deleteUser = async (userId) => {
    try {
        const res = await fetch(`/api/sessions/users/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        mostrarResultados(await res.json());
    } catch (error) { mostrarResultados({ error: error.message }); }
};
