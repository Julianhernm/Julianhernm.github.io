let ingresos_brutos = document.getElementById("ingresos-brutos");
let p1 = document.getElementById("parrafo1");
let p2 = document.getElementById("parrafo2");
let p3 = document.getElementById("parrafo3");
let p4 = document.getElementById("parrafo4");
let submit = document.getElementById("submit");

const numberFormat = new Intl.NumberFormat('es-GT', { style: 'decimal', minimumFractionDigits: 2 });

function redondearPersonalizado(valor) {
    let str = valor.toFixed(3); 
    let milesima = parseInt(str.charAt(str.length - 1));

    if (milesima >= 5) {
        return Math.ceil(valor * 100) / 100; 
    } else {
        return Math.floor(valor * 100) / 100; 
    }
}

submit.onclick = function() {
    let valor = ingresos_brutos.value.replace(/,/g, '').trim(); 

    if (valor === "" || isNaN(Number(valor))) {
        p1.style.color = "red";
        p1.textContent = "Dato inválido: ingresa un número";
        p2.textContent = "";
    } else if (valor <= 0) {
        p1.style.color = "blue";
        p1.style.marginTop = "5px";
        p1.style.fontSize = "1.3em";
        p1.textContent = "No Generaste Ganancias. :(";
    } else {
        let ingresos = Number(valor);

        // Cálculo y redondeo de ISR
        let isr_sin_redondear = ingresos * 0.25;
        let isr = redondearPersonalizado(isr_sin_redondear);

        let reserva_legal = (ingresos - isr) * 0.05;
        let ganancia = ingresos - isr - reserva_legal;

        p1.style.color = "white";
        p1.style.padding = "10px";
        p1.style.marginTop = "5px";
        p1.textContent = "ISR: Q. " + numberFormat.format(isr);

        p2.style.color = "white";
        p2.style.padding = "10px";
        p2.style.marginTop = "5px";
        p2.textContent = "Reserva Legal: Q. " + numberFormat.format(reserva_legal);

        p3.style.color = "white";
        p3.style.padding = "10px";
        p3.style.marginTop = "5px";
        p3.textContent = "Ganancia: Q. " + numberFormat.format(ganancia);

        p4.style.padding = "10px";
        p4.style.color = "white";
        p4.style.marginTop = "5px";
        p4.textContent = "Total: Q. " + numberFormat.format(ganancia + isr + reserva_legal);
    }
};

ingresos_brutos.addEventListener("input", () => {
    let raw = ingresos_brutos.value.replace(/,/g, '').trim();
    if (raw !== "" && !isNaN(Number(raw))) {
        let formatted = numberFormat.format(Number(raw));
        preview.textContent = "Vista previa: Q. " + formatted;
    } else {
        preview.textContent = "";
    }
});


ingresos_brutos.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        submit.click();        
    }
});
