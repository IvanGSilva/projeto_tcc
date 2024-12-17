// Verifica se a idade é maior ou igual a 18
function isAgeValid(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}

// Valida o CPF
function isCPFValid(cpf) {
    if (!cpf || typeof cpf !== 'string') return false;

    cpf = cpf.replace(/\D+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Valida a CNH
function isCNHValid(cnh) {
    // Remove caracteres não numéricos e verifica se tem exatamente 11 dígitos
    return /^[0-9]{11}$/.test(cnh);
}

// Valida a data e hora da viagem
function isRideDateTimeValid(date, time) {
    const rideDateTime = new Date(`${date}T${time}`); // Data e hora da viagem
    const now = new Date(); // Data e hora atuais

    // Valida se a data/hora informada é válida
    if (isNaN(rideDateTime.getTime())) {
        return { valid: false, error: 'Data ou hora inválida.' };
    }

    // Se a data da viagem for no passado
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define "hoje" às 00:00:00
    if (rideDateTime < today) {
        return { valid: false, error: 'A viagem não pode estar no passado.' };
    }

    // Verifica se a viagem é hoje
    if (rideDateTime.toDateString() === now.toDateString()) {
        const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000); // 30 minutos a partir de agora

        if (rideDateTime < thirtyMinutesLater) {
            return { valid: false, error: 'A viagem deve iniciar no mínimo 30 minutos após o horário atual.' };
        }
    }

    return { valid: true }; // Validação bem-sucedida
}

// Valida a quantidade de assentos
function isSeatsValid(seats) {
    if (seats < 1 || seats == 0) {
        return { valid: false, error: 'O número de assentos deve ser pelo menos 1.' };
    }
    return { valid: true };
}

module.exports = {
    isAgeValid,
    isCPFValid,
    isCNHValid,
    isRideDateTimeValid,
    isSeatsValid
};
