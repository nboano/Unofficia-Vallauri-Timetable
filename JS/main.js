class Main {
    static #classi = [new Classe()];
    static #classe = new Classe();
    static #ottieniorari = async (url) => {
        var a = [];
        var pdf = await pdfjsLib.getDocument(url).promise;
        var npag = pdf.numPages;
        for (var i = 1; i < npag; i++) {
            var txt = (await (await pdf.getPage(i)).getTextContent()).items;
            var cls = Classe.CreaDaPagina(txt);
            a.push(cls);
        }
        return a;
    }
    static CaricaOrario = async (url) => {
        Controls.cmbClasse.setAttribute("disabled", "");
        this.#classi = await this.#ottieniorari(url);
        Controls.cmbClasse.innerHTML = "";
        for (var o of this.#classi) {
            Controls.cmbClasse.innerHTML += `<option>${o.Nome}</option>`;
        }
        Controls.cmbClasse.removeAttribute("disabled");
        if (localStorage.ClasseSelez) this.ClasseSelez = localStorage.ClasseSelez;
        else this.ClasseSelez = "1A AFM";
    }
    static CaricaClasse(n) {
        var cls = this.#classi[n];
        this.#classe = cls;
        Controls.lblNomeClasse.innerText = cls.Nome;
        Controls.lblIntestazioneClasse.innerText = cls.Intestazione.substring(cls.Intestazione.indexOf("<"));
        Controls.lblNumeroStudenti.innerText = cls.NumStudenti;
        Controls.lblCoordinatore.innerText = cls.Coordinatore;

        var cd = new Date().getDay();
        if (cd != 0) cd--;
        this.VisualizzaOrario(cd);
    }
    static VisualizzaOrario(n) {
        var orario = this.#classe.Orario[n];
        Controls.lblCurrentDay.innerHTML = orario.nome;

        Controls.grpOrario.innerHTML = "";
        for (var m of orario) {
            Controls.grpOrario.innerHTML += `
                <div class="tile">
                    <pre> ${m.OraInizio}<sup>a</sup> ${m.OraInizio == m.OraFine ? "" : `e ${m.OraFine}<sup>a</sup>`} ora</pre>
                    <br />
                    <h3>${m.Materia}</h3>
                    <br />
                    <div><pre>${m.Docente}</pre></div>
                    <div><pre>${m.Aula}</pre></div>
                </div>
                <br/>
            `;
        }
    }
    static get OrarioSelez() {
        return Controls.cmbOrario.value;
    }
    static set OrarioSelez(o) {
        Controls.cmbOrario.value = o;
        var url = "https://orario.vallauri.edu/files/" + o + ".pdf";
        this.CaricaOrario(url);
        localStorage.OrarioSelez = this.OrarioSelez;
    }
    static get ClasseSelez() {
        return Controls.cmbClasse.value;
    }
    static set ClasseSelez(o) {
        Controls.cmbClasse.value = o;
        this.CaricaClasse(Controls.cmbClasse.selectedIndex);
        localStorage.ClasseSelez = this.ClasseSelez;
    }
}
window.addEventListener("load", function () {
    if (localStorage.OrarioSelez) Main.OrarioSelez = localStorage.OrarioSelez;
    else Main.OrarioSelez = "A_TUTTE";
    Controls.cmbOrario.onchange = (e) => Main.OrarioSelez = e.target.value;
    Controls.cmbClasse.onchange = (e) => Main.ClasseSelez = e.target.value;
})