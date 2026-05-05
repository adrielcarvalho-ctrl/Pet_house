// Banco de dados inicial simulado
const initialPets = [
    {
        id: "1",
        name: "Thor",
        type: "cachorro",
        age: "adulto",
        size: "grande",
        location: "Palmas - TO", // Atualizado para a realidade local
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80",
        description: "Thor é um Golden Retriever super carinhoso e ativo. Adora brincar e é ótimo com crianças. Procura uma família que tenha espaço para ele correr.",
        gender: "macho",
        vaccinated: true,
        neutered: true
    },
    {
        id: "2",
        name: "Luna",
        type: "gato",
        age: "filhote",
        size: "pequeno",
        location: "Palmas - TO",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&q=80",
        description: "Luna é uma gatinha brincalhona e curiosa. Adora carinho e ronrona muito! Ideal para apartamento.",
        gender: "femea",
        vaccinated: true,
        neutered: false
    },
    {
        id: "3",
        name: "Bob",
        type: "cachorro",
        age: "filhote",
        size: "medio",
        location: "Paraíso do Tocantins",
        image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&q=80",
        description: "Bob é um filhotinho cheio de energia! Precisa de uma família ativa que possa educá-lo e dar muito amor.",
        gender: "macho",
        vaccinated: true,
        neutered: false
    },
    {
        id: "4",
        name: "Nina",
        type: "gato",
        age: "adulto",
        size: "pequeno",
        location: "Porto Nacional",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80",
        description: "Nina é uma gatinha tranquila e independente. Gosta de carinho mas também de seu espaço. Perfeita para quem trabalha fora.",
        gender: "femea",
        vaccinated: true,
        neutered: true
    },
    {
        id: "5",
        name: "Max",
        type: "cachorro",
        age: "idoso",
        size: "pequeno",
        location: "Palmas - TO",
        image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=500&q=80",
        description: "Max é um senhor tranquilo que merece um lar acolhedor para aproveitar seus dias. Calmo e carinhoso.",
        gender: "macho",
        vaccinated: true,
        neutered: true
    },
    {
        id: "6",
        name: "Mel",
        type: "cachorro",
        age: "adulto",
        size: "medio",
        location: "Palmas - TO",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&q=80",
        description: "Mel é uma cachorrinha dócil e obediente. Adora passear e é super bem educada. Ideal para primeiro adotante.",
        gender: "femea",
        vaccinated: true,
        neutered: true
    }
];

// Carregar pets do localStorage ou usar os iniciais (Corrige o Efeito Amnésia)
let pets = JSON.parse(localStorage.getItem("pets"));
if (!pets || pets.length === 0) {
    pets = initialPets;
    localStorage.setItem("pets", JSON.stringify(pets));
}

let isLoggedIn = false;
let userName = "";
let selectedPetId = null;

window.onload = function() {
    checkLogin();
    renderPets();
    setupFilters();
};

function checkLogin() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        isLoggedIn = true;
        userName = userData.name;
        updateUI();
    }
}

function updateUI() {
    if (isLoggedIn) {
        document.getElementById("userInfo").textContent = `Olá, ${userName}!`;
        document.getElementById("userInfo").classList.remove("hidden");
        document.getElementById("loginBtn").classList.add("hidden");
        document.getElementById("addPetBtn").classList.remove("hidden");
        document.getElementById("logoutBtn").classList.remove("hidden");
    } else {
        document.getElementById("userInfo").classList.add("hidden");
        document.getElementById("loginBtn").classList.remove("hidden");
        document.getElementById("addPetBtn").classList.add("hidden");
        document.getElementById("logoutBtn").classList.add("hidden");
    }
}

function renderPets() {
    const grid = document.getElementById("petsGrid");
    const noResults = document.getElementById("noResults");

    // Adicionado o filtro de busca por nome (RF09)
    const filters = {
        name: document.getElementById("searchName") ? document.getElementById("searchName").value.toLowerCase() : "",
        type: document.getElementById("filterType").value,
        age: document.getElementById("filterAge").value,
        size: document.getElementById("filterSize").value,
        location: document.getElementById("filterLocation").value.toLowerCase()
    };

    const filteredPets = pets.filter(pet => {
        if (filters.name && !pet.name.toLowerCase().includes(filters.name)) return false;
        if (filters.type && pet.type !== filters.type) return false;
        if (filters.age && pet.age !== filters.age) return false;
        if (filters.size && pet.size !== filters.size) return false;
        if (filters.location && !pet.location.toLowerCase().includes(filters.location)) return false;
        return true;
    });

    const count = filteredPets.length;
    document.getElementById("petCount").textContent = `${count} ${count === 1 ? 'pet disponível' : 'pets disponíveis'} para adoção`;

    if (filteredPets.length === 0) {
        grid.innerHTML = "";
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
        grid.innerHTML = filteredPets.map(pet => `
            <div class="pet-card" onclick="showPetDetails('${pet.id}')">
                <img src="${pet.image}" alt="${pet.name}" class="pet-image">
                <div class="pet-info">
                    <div class="pet-name">${pet.name}</div>
                    <div class="pet-details">
                        <span class="badge">${capitalizeFirst(pet.type)}</span>
                        <span class="badge">${capitalizeFirst(pet.age)}</span>
                        <span class="badge">${capitalizeFirst(pet.size)}</span>
                    </div>
                    <div class="pet-location">📍 ${pet.location}</div>
                </div>
            </div>
        `).join("");
    }
}

function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setupFilters() {
    document.getElementById("searchName")?.addEventListener("input", renderPets);
    document.getElementById("filterType").addEventListener("change", renderPets);
    document.getElementById("filterAge").addEventListener("change", renderPets);
    document.getElementById("filterSize").addEventListener("change", renderPets);
    document.getElementById("filterLocation").addEventListener("input", renderPets);
}

// Sistema de Registro
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const phone = document.getElementById("registerPhone").value;
    
    // Captura dos checkboxes de contato (RF01)
    const acceptWhatsapp = document.getElementById("acceptWhatsapp") ? document.getElementById("acceptWhatsapp").checked : false;
    const acceptCall = document.getElementById("acceptCall") ? document.getElementById("acceptCall").checked : false;

    const errorDiv = document.getElementById("registerError");
    const successDiv = document.getElementById("registerSuccess");

    // Validações
    if (password !== confirmPassword) {
        errorDiv.textContent = "As senhas não coincidem!";
        errorDiv.classList.remove("hidden");
        successDiv.classList.add("hidden");
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = "A senha deve ter no mínimo 6 caracteres!";
        errorDiv.classList.remove("hidden");
        successDiv.classList.add("hidden");
        return;
    }

    // Verificar se o email já existe
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        errorDiv.textContent = "Este email já está cadastrado!";
        errorDiv.classList.remove("hidden");
        successDiv.classList.add("hidden");
        return;
    }

    // Criar novo usuário com os dados de contato adicionados
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        phone: phone,
        acceptWhatsapp: acceptWhatsapp,
        acceptCall: acceptCall,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Mostrar mensagem de sucesso
    errorDiv.classList.add("hidden");
    successDiv.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";
    successDiv.classList.remove("hidden");

    // Limpar formulário
    document.getElementById("registerForm").reset();

    // Redirecionar para login após 2 segundos
    setTimeout(() => {
        closeRegisterModal();
        switchToLogin();
    }, 2000);
});

// Sistema de Login
document.getElementById("loginBtn").addEventListener("click", function() {
    document.getElementById("loginModal").classList.add("active");
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errorDiv = document.getElementById("loginError");

    // Buscar usuários cadastrados
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Login bem-sucedido
        userName = user.name;
        isLoggedIn = true;
        localStorage.setItem("currentUser", JSON.stringify(user));
        updateUI();
        closeLoginModal();
        errorDiv.classList.add("hidden");
    } else {
        // Login falhou
        errorDiv.textContent = "Email ou senha incorretos!";
        errorDiv.classList.remove("hidden");
    }
});

function closeLoginModal() {
    document.getElementById("loginModal").classList.remove("active");
    document.getElementById("loginForm").reset();
    document.getElementById("loginError").classList.add("hidden");
}

function closeRegisterModal() {
    document.getElementById("registerModal").classList.remove("active");
    document.getElementById("registerForm").reset();
    document.getElementById("registerError").classList.add("hidden");
    document.getElementById("registerSuccess").classList.add("hidden");
}

function switchToRegister() {
    closeLoginModal();
    document.getElementById("registerModal").classList.add("active");
}

function switchToLogin() {
    closeRegisterModal();
    document.getElementById("loginModal").classList.add("active");
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    isLoggedIn = false;
    userName = "";
    localStorage.removeItem("currentUser");
    updateUI();
});

// Adicionar Pet
document.getElementById("addPetBtn").addEventListener("click", function() {
    document.getElementById("addPetModal").classList.add("active");
});

document.getElementById("addPetForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const newPet = {
        id: Date.now().toString(),
        name: document.getElementById("petName").value,
        type: document.getElementById("petType").value,
        age: document.getElementById("petAge").value,
        size: document.getElementById("petSize").value,
        gender: document.getElementById("petGender").value,
        location: document.getElementById("petLocation").value,
        image: document.getElementById("petImage").value,
        description: document.getElementById("petDescription").value,
        vaccinated: document.getElementById("petVaccinated").checked,
        neutered: document.getElementById("petNeutered").checked
    };

    // Adiciona o novo pet e salva no localStorage
    pets.unshift(newPet);
    localStorage.setItem("pets", JSON.stringify(pets));
    
    renderPets();
    closeAddPetModal();
});

function closeAddPetModal() {
    document.getElementById("addPetModal").classList.remove("active");
    document.getElementById("addPetForm").reset();
}

// Detalhes do Pet
function showPetDetails(id) {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;

    selectedPetId = id;
    document.getElementById("detailName").textContent = pet.name;
    document.getElementById("detailImage").src = pet.image;
    document.getElementById("detailType").textContent = capitalizeFirst(pet.type);
    document.getElementById("detailAge").textContent = capitalizeFirst(pet.age);
    document.getElementById("detailSize").textContent = capitalizeFirst(pet.size);
    document.getElementById("detailGender").textContent = capitalizeFirst(pet.gender);
    document.getElementById("detailLocation").textContent = pet.location;
    document.getElementById("detailVaccinated").textContent = pet.vaccinated ? "Sim" : "Não";
    document.getElementById("detailNeutered").textContent = pet.neutered ? "Sim" : "Não";
    document.getElementById("detailDescription").textContent = pet.description;

    document.getElementById("detailsModal").classList.add("active");
}

function adoptPet() {
    if (!isLoggedIn) {
        alert("Você precisa fazer login para adotar um pet!");
        closeDetailsModal();
        document.getElementById("loginModal").classList.add("active");
        return;
    }

    const pet = pets.find(p => p.id === selectedPetId);
    if (pet) {
        // Regra de Negócio corrigida: Comunicação externa conforme RNF06
        alert(`Oba! Você manifestou interesse em adotar o(a) ${pet.name}!\n\nEntre em contato com o responsável pelo WhatsApp ou Ligação para combinar a adoção.`);
        closeDetailsModal();
    }
}

function closeDetailsModal() {
    document.getElementById("detailsModal").classList.remove("active");
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.classList.remove("active");
    }
};