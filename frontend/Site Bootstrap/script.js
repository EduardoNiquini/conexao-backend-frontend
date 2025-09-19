class AuthSystem {
    constructor() {
        this.currentUser = null
        this.init()
    }

    init() {
        this.setupEventListeners()
    }

    setupEventListeners() {
        const lf = document.getElementById("loginForm")
        const rf = document.getElementById("registerForm")
        const lo = document.getElementById("logoutBtn")
        const lm = document.getElementById("modalLogin")
    }

    handleLogout(e) {
        e.preventDefault()
        this.currentUser = null
        this.showLoginInterface()
        this.showNotification("Logout realizado com sucesso!", "success")
    }

    showUserInterface() {
        const l = document.getElementById("loginNavItem") // botão de "Login"
        const u = document.getElementById("userDropdown") // dropdown do usuário
        const n = document.getElementById("userName")     // span para o nome
    
        if (l && u && n) {
            l.classList.add("d-none")      // esconde botão login
            u.classList.remove("d-none")   // mostra dropdown do usuário
            n.textContent = this.currentUser.name.split(" ")[0] // mostra primeiro nome
        }
    }    


    showLoginInterface() {
        const l = document.getElementById("loginNavItem")
        const u = document.getElementById("userDropdown")

        if (l && u) {
            l.classList.remove("d-none")
            u.classList.add("d-none")
        }
    }

    // resetForms() {
    //     const lf = document.getElementById("loginForm")
    //     const rf = document.getElementById("registerForm")
    //     if (lf) lf.reset()
    //     if (rf) rf.reset()

    //     const lt = document.getElementById("login-tab")
    //     if (lt) new bootstrap.Tab(lt).show()
    // }

    showNotification(msg, t = "info") {
        const n = document.createElement("div")
        n.className = `alert alert-${t === "error" ? "danger" : t === "success" ? "success" : "info"} alert-dismissible fade show position-fixed`
        n.style.cssText = "top:20px;right:20px;z-index:99999;min-width:300px"
        n.innerHTML = `${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`

        document.body.appendChild(n)
        setTimeout(() => { if (n.parentNode) n.remove() }, 5000)
    }

    getCurrentUser() { return this.currentUser }
    isLoggedIn() { return this.currentUser !== null }
    getUserPlan() { return this.currentUser ? "Básico" : null }
}

// document.addEventListener("DOMContentLoaded", () => {
//     if (window.AOS) window.AOS.init({ duration: 1000, once: true })
//     window.authSystem = new AuthSystem()

//     const cf = document.querySelector("#contato form")
//     if (cf) {
//         cf.addEventListener("submit", function (e) {
//             e.preventDefault()
//             const n = document.getElementById("nome").value
//             const e1 = document.getElementById("email").value
//             const m = document.getElementById("mensagem").value

//             if (n && e1 && m) {
//                 window.authSystem.showNotification("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success")
//                 this.reset()
//             } else {
//                 window.authSystem.showNotification("Por favor, preencha todos os campos.", "error")
//             }
//         })
//     }

document.addEventListener("DOMContentLoaded", () => {
    if (window.AOS) window.AOS.init({ duration: 1000, once: true })
    window.authSystem = new AuthSystem()

    // FORM LOGIN
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault() // impede reload
            login_usuario()
        })
    }

    // FORM REGISTRO
    const registerForm = document.getElementById("registerForm")
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault() // impede reload
            cadastrar_usuario()
        })
    }

    // LOGOUT
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault()
            window.authSystem.handleLogout(e)
        })
    }
})


    document.querySelectorAll('[data-bs-target^="#modal"]:not([data-bs-target="#modalLogin"])').forEach(b => {
        const m = b.getAttribute("data-bs-target")
        const sb = document.querySelector(`${m} .btn-primary, ${m} .btn-success, ${m} .btn-warning`)

        if (sb) {
            sb.addEventListener("click", function () {
                if (window.authSystem.isLoggedIn()) {
                    const pn = this.textContent.replace("Assinar Plano ", "")
                    window.authSystem.showNotification(`Redirecionando para pagamento do ${pn}...`, "success")
                } else {
                    window.authSystem.showNotification("Faça login para assinar um plano!", "error")
                    const cm = bootstrap.Modal.getInstance(this.closest(".modal"))
                    if (cm) cm.hide()

                    setTimeout(() => {
                        new bootstrap.Modal(document.getElementById("modalLogin")).show()
                    }, 300)
                }
            })
        }
    })



async function cadastrar_usuario() {
    const usuario = {
        nome: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        senha: document.getElementById("registerPassword").value
    }

    try {
        const resposta = await fetch("http://localhost:5000/cadusuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        const data = await resposta.json();
        alert(data.mensagem || "Cadastro realizado!")
    } catch (erro) {
        console.error(erro);
        alert("Falha ao cadastrar.");
    }
}


async function login_usuario() {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginPassword").value;

    if (!email || !senha) {
        window.authSystem.showNotification("Preencha todos os campos!", "error");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await resposta.json();

        if (resposta.ok) {
            window.authSystem.currentUser = { name: email.split("@")[0], email }
            window.authSystem.showNotification(data.message || "Login realizado com sucesso!", "success")
            
            // 🔑 troca botão Login → Nome usuário
            window.authSystem.showUserInterface()

            // fecha modal
            const m = bootstrap.Modal.getInstance(document.getElementById("modalLogin"))
            if (m) m.hide()
        } else {
            window.authSystem.showNotification(data.message || "Usuário ou senha incorretos!", "error")
        }
    } catch (erro) {
        console.error(erro);
        window.authSystem.showNotification("Falha na conexão com o servidor.", "error");
    }
}

