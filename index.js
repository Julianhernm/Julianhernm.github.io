document.addEventListener('DOMContentLoaded', function () {
    const ingresosBrutos = document.getElementById("ingresos-brutos");
    const exencionPerdida = document.getElementById("exenciones-isr-perdida");
    const exencionGanancia = document.getElementById("exenciones-isr-ganancia");
    const otrasExenciones = document.getElementById("otras-exenciones");
    const submitBtn = document.getElementById("submit");
    const resultsDiv = document.getElementById("results");
    const errorIngresos = document.getElementById("error-ingresos");

    const baseImponible = document.getElementById("base-imponible");
    const p1 = document.getElementById("parrafo1");
    const p2 = document.getElementById("parrafo2");
    const p3 = document.getElementById("parrafo3");
    const p4 = document.getElementById("parrafo4");

    const numberFormat = new Intl.NumberFormat('es-GT', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function evaluarExpresion(expr) {
        if (!expr || expr.trim() === '') return 0;

        expr = expr.replace(/,/g, '').trim();

        if (!isNaN(expr)) return parseFloat(expr);

        if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
            return NaN;
        }

        try {
            return new Function("return " + expr)();
        } catch (e) {
            console.error("Error evaluating expression:", e);
            return NaN;
        }
    }

    function formatInput(input) {
        const rawValue = input.value;
        const evaluatedValue = evaluarExpresion(rawValue);

        if (isNaN(evaluatedValue)) {
            input.style.border = "2px solid red";
            return NaN;
        }

        input.style.border = "";
        input.value = numberFormat.format(evaluatedValue);
        return evaluatedValue;
    }

    ingresosBrutos.addEventListener('blur', () => formatInput(ingresosBrutos));
    exencionPerdida.addEventListener('blur', () => formatInput(exencionPerdida));
    exencionGanancia.addEventListener('blur', () => formatInput(exencionGanancia));
    otrasExenciones.addEventListener('blur', () => formatInput(otrasExenciones));

    submitBtn.onclick = function () {
        // Reset error
        errorIngresos.style.display = 'none';
        errorIngresos.textContent = '';

        const valorExpr = ingresosBrutos.value;
        const valor = evaluarExpresion(valorExpr);

        if (isNaN(valor)) {
            errorIngresos.textContent = "Expresión inválida en ingresos brutos";
            errorIngresos.style.display = 'block';
            resultsDiv.style.display = 'none';
            return;
        }

        if (valor <= 0) {
            resultsDiv.style.display = 'block';
            baseImponible.textContent = "Q 0.00";
            p1.textContent = "Q 0.00";
            p2.textContent = "Q 0.00";
            p3.textContent = "Q 0.00";
            p4.textContent = "Q 0.00";
            return;
        }

        const perExpr = exencionPerdida.value;
        const ganExpr = exencionGanancia.value;
        const otrosExpr = otrasExenciones.value;

        let per = evaluarExpresion(perExpr) || 0;
        let gan = evaluarExpresion(ganExpr) || 0;
        let otros = evaluarExpresion(otrosExpr) || 0;


        if (isNaN(per) || isNaN(gan) || isNaN(otros)) {
            errorIngresos.textContent = "Una o más exenciones contienen expresiones inválidas";
            errorIngresos.style.display = 'block';
            resultsDiv.style.display = 'none';
            return;
        }


        let base = valor - gan + per + otros;


        if (base < 0) base = 0;


        let isr = base * 0.25;
        let reserva_legal = (base - isr) * 0.05;
        let ganancia = base - isr - reserva_legal;
        let total = ganancia + isr + reserva_legal;


        resultsDiv.style.display = 'block';
        baseImponible.textContent = "Q " + numberFormat.format(base);
        p1.textContent = "Q " + numberFormat.format(isr);
        p2.textContent = "Q " + numberFormat.format(reserva_legal);
        p3.textContent = "Q " + numberFormat.format(ganancia);
        p4.textContent = "Q " + numberFormat.format(total);
    };
});
