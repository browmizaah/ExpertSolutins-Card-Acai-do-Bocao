// Variáveis e constantes
const infHora = document.getElementById("horario-span");
const menu = document.getElementById("menu");
const telaCarrinhoModal = document.getElementById("cart-modal");
const carrinhoItens = document.getElementById("cart-items");
const carrinhoTotal = document.getElementById("cart-total");
const endereco = document.getElementById("address");
const endAviso = document.getElementById("address-warn");
const btnFechar = document.getElementById("close-modal-btn");
const btnEnviar = document.getElementById("send-btn");
const btnCarrinho = document.getElementById("cart-btn");
const quantidadeItens = document.getElementById("cart-count");

let carrinho = [];
let total = 0;

// Ações dos botões carrinho, fechar, enviar.
btnCarrinho.addEventListener("click", () => {
    telaCarrinhoModal.style.display = "flex";
});

btnFechar.addEventListener("click", () => {
    telaCarrinhoModal.style.display = "none";
});

telaCarrinhoModal.addEventListener("click", (event) => {
    if (event.target === telaCarrinhoModal) {
        telaCarrinhoModal.style.display = "none";
    }
});

// Função que verifica se o estabelecimento está aberto ou fechado
function abertoFechado() {
    const hora = new Date().getHours();
    return hora >= 12 && hora < 20;
}

// Atualiza o carrinho
function atualizaCarrinho() {
    carrinhoItens.innerHTML = "";
    total = 0;

    carrinho.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "md-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium mt-2">${item.nome}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-1">R$ ${item.valor.toFixed(2)}</p>
                </div>
                <div class="flex flex-col items-center">
                    <button class="add-item-btn mb-2 font-bold" data-name="${item.nome}">Add</button>
                    <button class="remove-cart-btn font-bold" data-name="${item.nome}">Remover</button>
                </div>
            </div>
        `;
        total += item.valor * item.quantity;
        carrinhoItens.appendChild(cartItemElement);
    });

    carrinhoTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    quantidadeItens.textContent = carrinho.length;
}

// Adiciona itens ao carrinho
function selecionarItems(nome, valor) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        carrinho.push({ nome, valor, quantity: 1 });
    }
    atualizaCarrinho();
}

menu.addEventListener("click", (event) => {
    const meuCarrinho = event.target.closest(".add-to-cart-btn");
    if (meuCarrinho) {
        const nome = meuCarrinho.getAttribute("data-name");
        const valor = parseFloat(meuCarrinho.getAttribute("data-price"));
        selecionarItems(nome, valor);
    }
});

// Remove itens do carrinho
function removerItems(nome) {
    const index = carrinho.findIndex(item => item.nome === nome);

    if (index !== -1) {
        if (carrinho[index].quantity > 1) {
            carrinho[index].quantity -= 1;
        } else {
            carrinho.splice(index, 1);
        }
        atualizaCarrinho();
    }
}

// Eventos para adicionar e remover itens
carrinhoItens.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-item-btn")) {
        const nome = event.target.getAttribute("data-name");
        const itemExistente = carrinho.find(item => item.nome === nome);
        if (itemExistente) {
            selecionarItems(nome, itemExistente.valor);
        }
    } else if (event.target.classList.contains("remove-cart-btn")) {
        const nome = event.target.getAttribute("data-name");
        removerItems(nome);
    }
});

// Validação de endereço
endereco.addEventListener("input", (event) => {
    const inputValor = event.target.value;
    if (inputValor !== "") {
        endereco.classList.remove("border-red-500");
        endAviso.classList.add("hidden");
    }
});

// Envio do pedido
btnEnviar.addEventListener("click", () => {
    if (!abertoFechado()) {
        Toastify({
            text: "Ops, no momento estamos fechados!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "#ef4444" }
        }).showToast();
        return;
    }

    if (carrinho.length === 0 || endereco.value === "") {
        if (endereco.value === "") {
            endAviso.classList.remove("hidden");
            endereco.classList.add("border-red-500");
        }
        return;
    }

    const cartItems = carrinho.map(item => `
${item.nome}
Quantidade: (${item.quantity})
Preço: R$${item.valor.toFixed(2)}
`).join("");

    const envPedido = encodeURIComponent(cartItems);
    const numTelefone = "19982933955";
    window.open(`https://wa.me/${numTelefone}?text=${envPedido}%0ATotal: R$ ${total.toFixed(2)}%0A🛵Endereço: ${endereco.value}`, "_blank");

    carrinho = [];
    atualizaCarrinho();
});

// Atualiza o indicador de horário aberto/fechado
const open = abertoFechado();
infHora.classList.toggle("bg-green-600", open);
infHora.classList.toggle("bg-red-500", !open);