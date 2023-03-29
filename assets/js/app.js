import { valida } from "./validação.js";  

/* busca no html por todas as tags inputs */
const inputs = document.querySelectorAll('input');

/* laço de repetição para chamar a função de validação */
inputs.forEach(input => {
    /* veridicação de valor no preço na cadastro de produto */
    if(input.dataset.tipo == "preco"){
        SimpleMaskMoney.setMask(input, {
            // configuração da mascara
            prefix: 'R$ ', //unidade antes do valor
            fixed: true, 
            fractionDigits: 2, //casas depois da virgula
            decimalSeparator: ',', //reparação de centavos 
            thousandsSeparator: '.', // separação de milhar
            cursor: 'end' //como vai ser escrito o valor
        });
    };  

    input.addEventListener('blur', (evento)=>{
        valida(evento.target);
    });
});