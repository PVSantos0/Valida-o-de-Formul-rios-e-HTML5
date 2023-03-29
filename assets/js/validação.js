/* para chamar as funções 
const dataNascimento = document.querySelector('#nascimento');

 evento de foco 
dataNascimento.addEventListener('blur', (evento)=>{
    validaDataNascimento(evento.target);
}); */

/* validar os inputs */
export function valida(input){
    /* descobrir o tipo de input */
    const tipoInput = input.dataset.tipo // para poder descobrir tipo de input usa dataset

    if (validadores[tipoInput]) {
        validadores[tipoInput](input);
    };

    /* verifica se ta valido o campo */
    if(input.validity.valid){
        /* se estiver valido o campo vai remover a classe*/
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    }else{
        /* se não estiver valido o campo vai adiciona a classe*/
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoInput, input);
    };
};

/* este vetor é para ver qual erro esta acontecendo */
const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
];

/* objeto com as mensagem de erro */
const mensagemsErro = {
    nome:{
        valueMissing:"O campo nome não pode esta vazio."
    },

    email:{
        valueMissing:"O campo email não pode esta vazio.",
        typeMismatch:"O email digitado não é válido"
    },
    senha: {
        valueMissing:"O campo senha não pode esta vazio.",
        patternMismatch:"A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos."
    },
    dataNascimento: {
        valueMissing:"O campo data de nascimento não pode esta vazio.",
        customError:"Você tem que ser maior de 18 anos para se cadastrar"
    },
    cpf: {
        valueMissing:"O campo de CPF não pode esta vazio.",
        customError:'O CPF digitaldo não é valido'
    },
    cep: {
        valueMissing:"O campo de CEP não pode esta vazio.",
        patternMismatch:'O CEP digitaldo não é valido',
        customError:'Não foi possivel buscar o CEP'
    },
    logradouro: {
        valueMissing:"O campo de logradouro não pode esta vazio."
    },
    cidade: {
        valueMissing:"O campo de cidade não pode esta vazio."
    },
    estado: {
        valueMissing:"O campo de estado não pode esta vazio."
    },
    preco:{
        valueMissing:"O campo de preço não pode esta vazio."
    },
};


/* objeto que contem tipos de inputs */
const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
};

function mostraMensagemDeErro(tipoInput, input){
    let mensagem = '';
    /* este laço é para ver qual tipo de erro esta contecendo */
    tiposDeErro.forEach(erro => {
        if(input.validity[erro]){
            mensagem = mensagemsErro[tipoInput][erro];
        };
    });
    return mensagem
};


function validaDataNascimento(input){
    /* caputura a data de nascimento*/
    const dataRecebida = new Date(input.value);
    /* mensagem caso a pessoal seja maior */
    let mensagem = "";

    if (!mais18(dataRecebida)/* Recebe a data de nascimento */){
       /* mensagem caso a pessoal seja menor */
        mensagem = "Você tem que ser maior de 18 anos para se cadastrar";
    }; 
    
    /* para validar só mente se for maior */
    input.setCustomValidity(mensagem);
};


function mais18(data){
    /* captura data de hoje */
    const dataAtual = new Date(); /* new Date() vazio pega a data do dia */

    /* soma da data mais 18 anos */
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    /* checar se data é maior de 18 anos */
    return dataMais18 <= dataAtual;
};

/* validar o cpf */
function validaCPF(input){
    const cpfFormatado = input.value.replace(/\D/g, "");
    //este código pegar tudo que esta na tag input e o que não é número vira campo vazio
    let mensagem = '';
    
    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){
        mensagem = 'O CPF digitaldo não é valido';
    };
    
    input.setCustomValidity(mensagem);
};

function checaCPFRepetido(cpf){
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ];

    let cpfValido = true;

    /* verifique se o campo cpf foi cadastrado com números repetidos */
    valoresRepetidos.forEach(valor => {
        if(valor == cpf){
            cpfValido = false;
        };
    });

    return cpfValido
};

/* faz a verificação se CPF é real (correto seria usar api da receita federal)*/
function checaEstruturaCPF(cpf){
    const multiplicador = 10;

    return checaDigitoVerficador(cpf, multiplicador)
};

function checaDigitoVerficador(cpf, multiplicador){
    if(multiplicador >= 12){
        return true
    };

    let multiplicadorInicial = multiplicador;
    let soma = 0;
    
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');
    
    const digitoVerficador = cpf.charAt(multiplicador - 1);

    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--){
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial;
        contador++;
    };

    if (digitoVerficador == confirmaDigito(soma)){
        return checaDigitoVerficador(cpf, multiplicador + 1);
    };

    return false
};

function confirmaDigito(soma){

    return 11 - (soma % 11)
};

// validação CEP
function recuperarCEP(input){
    /* para ficar com valor de cep apenas com numeros */
    const cep = input.value.replace(/\D/g, '');

    /* URL da api que vai conseguir os dados do cep e dentro do URL tem variavel de cep*/
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    /* Neste objeto tem metodo, modo e espera da requisição  */
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    };

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                console.log(data)
                if (data.erro){
                    input.setCustomValidity('Não foi possivel buscar o CEP');
                    return
                }
                input.setCustomValidity('');
                preencheCamposComCEP(data);
                return 
            }
        );
    };
};

/* preechimento de dados recuparedos pelo CEP */
function preencheCamposComCEP(data){
    const logradouro = document.querySelector('[data-tipo="logradouro"]');
    const cidade = document.querySelector('[data-tipo="cidade"]');
    const estado = document.querySelector('[data-tipo="estado"]');

    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;
};