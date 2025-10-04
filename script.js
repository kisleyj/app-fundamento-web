// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades
    initializeNavigation()
    initializeMobileMenu()
    initializeRegisterForm()
    initializeLoginForm() // Nova função para o formulário de login
})

/**
* Função para scroll suave até uma seção
* @param {string} sectionId - ID da seção alvo
*/
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }
}

/**
 * Inicializar navegação suave
 */
function initializeNavigation() {
    // Selecionar todos os links de navegação
    const navLink = document.querySelectorAll('.nav-link, .nav-link-mobile')

    navLink.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault()
            const targetId = this.getAttribute('href').substring(1)
            scrollToSection(targetId)

            closeMobileMenu()
        })
    })
}

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle')
    const navMobile = document.getElementById('navMobile')

    if(menuToggle && navMobile) {
        menuToggle.addEventListener('click', function() {
            toggleMobileMenu()
        })

        document.addEventListener('click', function(event) {
            if(!menuToggle.contains(event.target) && !navMobile.contains(event.target)) {
                closeMobileMenu()
            }
        })
    }
}

/**
 * Alternar visibilidade do menu mobile
 */

function toggleMobileMenu() {
    const menuToggle = document.getElementById('menuToggle')
    const navMobile = document.getElementById('navMobile')

    menuToggle.classList.toggle('active')
    navMobile.classList.toggle('active')
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle')
    const navMobile = document.getElementById('navMobile')

    if(menuToggle && navMobile) {
        menuToggle.classList.remove('active')
        navMobile.classList.remove('active')
    }
}

// FORMULÁRIO DE CADASTRO

// Objeto para armazenar os dados do formulário
let formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
}

// Objetivo/variável para armazenar os erros
let formErrors = {}

function initializeRegisterForm() {
    const form = document.getElementById('registerForm')
    const inputs = form.querySelectorAll('.form-input')

    // Adicionar eventos de input para validação em tempo real
    inputs.forEach(input => {
        // Evento de input para limpar todos os erros e atualizar dados
        input.addEventListener('input', function() {
            const fieldName = this.name
            let value = this.value

            // Formatação especial para telefone
            if (fieldName === 'phone') {
                value = formatPhone(value)
                this.value = value
            }

            // Atualizar dados do fomulário
            formData[fieldName] = value

            clearFieldError(fieldName)
        })

        // Evento de blur para validação individual do campos
        input.addEventListener('blur', function() {
            validateField(this.name, this.value)
        })
    })

    form.addEventListener('submit', function(event) {
        event.preventDefault()
        handleRegisterFormSubmit()
    })
}

/**
 * Formatar telefone automaticament
 * @param {string} value - Valor do input
 * @returns {string} - Telefone Formatado
 */
function formatPhone(value) {
    // Remover tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Aplicat a formatação baseado no comprimento
    if(numbers.length <= 2) {
        return `(${numbers}`
    } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
}

/**
 * Validar um campo específico do formulário de registro
 * @param {string} fieldName = nome do campo
 * @param {string} value - Valor do campo
 * @returns {boolean} - Se o campo é válido
 */
function validateField(fieldName, value) {
    let isValid = true
    let errorMessage = ''

    switch (fieldName) {
        case 'name':
            if (!value.trim()) {
                errorMessage = 'Nome é obrigatório'
                isValid = false
            } else if (value.trim().length < 2) {
                errorMessage = 'Nome deve ter pelo menos 2 caracteres'
                isValid = false
            }
            break
        case 'email':
            if(!value.trim()) {
                errorMessage = 'E-mail é obrigatório'
                isValid = false
            } else if (!isValidEmail(value)) {
                errorMessage = 'E-mail inválido'
                isValid = false
            }
            break
        case 'phone':
            if(!value.trim()) {
                errorMessage = 'Telefone é obrigatório'
                isValid = false
            } else if (!isValidPhone(value)) {
                errorMessage = "Telefone deve estar no formato (xx) xxxxx-xxxx"
                isValid = false
            }
            break
        case 'password':
            if(!value) {
                errorMessage = 'Senha é obrigatória'
                isValid = false
            } else if (value.length < 6) {
                errorMessage = 'Senha deve ter pelo menos 6 caracteres'
                isValid = false
            }
            break
        case 'confirmPassword': 
            if (!value) {
                errorMessage = 'Confirmação de senha é obrigatória'
                isValid = false
            } else if (value !== formData.password) {
                errorMessage = 'Senhas não coincidem'
                isValid = false
            }
            break
    }

    if (!isValid) {
        showFieldError(fieldName, errorMessage)
        formErrors[fieldName] = errorMessage
    } else {
        clearFieldError(fieldName)
        delete formErrors[fieldName]
    }

    return isValid
}

/**
 * Validar e-mail usando regex
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} - Se o e-mai lé válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validar telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - Se o telefone é válido
 */
function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    return phoneRegex.test(phone)
}

/**
 * Exibir erros de campo
 * @param {string} fieldName - Nome do campo
 * @param {string} message - Mensagem de erro
 */
function showFieldError(fieldName, message) {
    const input = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}Error`)

    if (input && errorElement) {
        input.classList.add('error')
        errorElement.textContent = message
        errorElement.classList.add('show')
    }
}

/**
 * Limpar erros dos campos
 * @param {string} fieldName - Nome do Campo
 */
function clearFieldError(fieldName) {
    const input = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}Error`)

    if (input && errorElement) {
        input.classList.remove('error')
        errorElement.textContent = ''
        errorElement.classList.remove('show')
    }
}

/**
 * Validar todo o formulário de registro
 * @returns {boolean} - Se o formulário é válido
 */
function validateRegisterForm() {
    let isFormValid = true;

    for(const fieldName in formData) {
        const isFieldValid = validateField(fieldName, formData[fieldName])
        if(!isFieldValid) {
            isFormValid = false
        }
    }

    return isFormValid
}

function handleRegisterFormSubmit() {
    const submitBtn = document.getElementById('submitBtn')

    const form = document.getElementById('registerForm')
    const formElements = form.elements

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i]
        if (element.name && element.value !== undefined) {
            formData[element.name] = element.value
        }
    }

    if (!validateRegisterForm()) {
        console.log("❌ Formulário de CADASTRO contém erros. Corrija os campos destacados.")
        return
    }

    //Mostrar loading
    submitBtn.disabled = true
    submitBtn.classList.add('loading')
    submitBtn.textContent = 'Cadastrando...'

    // Simular envio (2 segundos)
    setTimeout(() => {
        // Exibit os dados no console
        console.log("=".repeat(50))
        console.log("✅ CADASTRO REALIZADO COM SUCESSO!")
        console.log("=".repeat(50))
        console.log("DADOS DO USUÁRIO:")
        console.log(`Nome: ${formData.name}`)
        console.log(`E-mail: ${formData.email}`)
        console.log(`Senha: ${formData.password}`)
        console.log(`Telefone: ${formData.phone}`)
        console.log("Data/Hora: ", new Date().toLocaleString("pt-BR"))
        console.log("=".repeat(50))

        // Mostrar mensagem de sucesso
        alert("Cadastro realizado com sucesso!\n\nVerifique o console do navegador (F12) para ver os dados enviados.")

        // Resetar formulário
        resetRegisterForm()

        // Remover loading
        submitBtn.disabled = false
        submitBtn.classList.remove('loading')
        submitBtn.textContent = "Criar conta"
    }, 2000)
}

function resetRegisterForm() {
    const form = document.getElementById('registerForm')
    form.reset()
    formData = {name: '', email: '', password: '', confirmPassword: '', phone: ''}
    for (const fieldName in formData) {
        clearFieldError(fieldName)
    }
    formErrors = {}
}


// --- LÓGICA DO FORMULÁRIO DE LOGIN ---

function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleLoginFormSubmit();
    });
}

function handleLoginFormSubmit() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const email = emailInput.value;
    const password = passwordInput.value;

    // Limpa erros anteriores
    clearFieldError('loginEmail');
    clearFieldError('loginPassword');

    let isValid = true;

    // Validação do E-mail
    if (!email.trim()) {
        showFieldError('loginEmail', 'E-mail é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('loginEmail', 'Formato de e-mail inválido');
        isValid = false;
    }

    // Validação da Senha
    if (!password) {
        showFieldError('loginPassword', 'Senha é obrigatória');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('loginPassword', 'A senha deve ter no mínimo 6 caracteres');
        isValid = false;
    }

    // Se o formulário for válido, exibe no console
    if (isValid) {
        console.log("=".repeat(50));
        console.log("🔒 TENTATIVA DE LOGIN");
        console.log("=".repeat(50));
        console.log(`E-mail: ${email}`);
        console.log(`Senha: ${password}`);
        console.log("Data/Hora: ", new Date().toLocaleString("pt-BR"));
        console.log("=".repeat(50));

        alert("Login efetuado com sucesso!\n\nVerifique o console do navegador (F12) para ver os dados.");

        // Reseta o formulário de login
        document.getElementById('loginForm').reset();
    } else {
        console.log("❌ Formulário de LOGIN contém erros.");
    }
}