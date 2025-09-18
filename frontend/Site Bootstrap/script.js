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

    if (lf) lf.addEventListener("submit", e => this.handleLogin(e))
    if (rf) rf.addEventListener("submit", e => this.handleRegister(e))
    if (lo) lo.addEventListener("click", e => this.handleLogout(e))
    if (lm) lm.addEventListener("hidden.bs.modal", () => this.resetForms())
  }

  handleLogin(e) {
    e.preventDefault()
    const email = document.getElementById("loginEmail").value.trim()
    const pwd = document.getElementById("loginPassword").value

    if (email && pwd) {
      this.currentUser = {
        name: email.split("@")[0],
        email,
        loginTime: new Date().toISOString()
      }

      this.showNotification("Login realizado com sucesso!", "success")
      const m = bootstrap.Modal.getInstance(document.getElementById("modalLogin"))
      if (m) m.hide()

      this.showUserInterface()
      this.resetForms()
    } else {
      this.showNotification("Por favor, preencha todos os campos!", "error")
    }
  }

  handleRegister(e) {
    e.preventDefault()
    const n = document.getElementById("registerName").value.trim()
    const em = document.getElementById("registerEmail").value.trim()
    const p = document.getElementById("registerPassword").value
    const c = document.getElementById("confirmPassword").value
    const t = document.getElementById("acceptTerms").checked

    if (!t) return this.showNotification("Você deve aceitar os termos de uso!", "error")
    if (p !== c) return this.showNotification("As senhas não coincidem!", "error")
    if (p.length < 6) return this.showNotification("A senha deve ter pelo menos 6 caracteres!", "error")

    if (n && em && p) {
      this.currentUser = { name: n, email: em, loginTime: new Date().toISOString() }
      this.showNotification("Conta criada com sucesso! Você foi logado automaticamente.", "success")

      const m = bootstrap.Modal.getInstance(document.getElementById("modalLogin"))
      if (m) m.hide()

      this.showUserInterface()
      this.resetForms()
    } else {
      this.showNotification("Por favor, preencha todos os campos!", "error")
    }
  }

  handleLogout(e) {
    e.preventDefault()
    this.currentUser = null
    this.showLoginInterface()
    this.showNotification("Logout realizado com sucesso!", "success")
  }

  showUserInterface() {
    const l = document.getElementById("loginNavItem")
    const u = document.getElementById("userDropdown")
    const n = document.getElementById("userName")

    if (l && u && n) {
      l.classList.add("d-none")
      u.classList.remove("d-none")
      n.textContent = this.currentUser.name.split(" ")[0]
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

  resetForms() {
    const lf = document.getElementById("loginForm")
    const rf = document.getElementById("registerForm")
    if (lf) lf.reset()
    if (rf) rf.reset()

    const lt = document.getElementById("login-tab")
    if (lt) new bootstrap.Tab(lt).show()
  }

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

document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) window.AOS.init({ duration: 1000, once: true })
  window.authSystem = new AuthSystem()

  const cf = document.querySelector("#contato form")
  if (cf) {
    cf.addEventListener("submit", function (e) {
      e.preventDefault()
      const n = document.getElementById("nome").value
      const e1 = document.getElementById("email").value
      const m = document.getElementById("mensagem").value

      if (n && e1 && m) {
        window.authSystem.showNotification("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success")
        this.reset()
      } else {
        window.authSystem.showNotification("Por favor, preencha todos os campos.", "error")
      }
    })
  }

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
})
