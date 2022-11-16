class Classe {
    static oreDiFine = [6, 6, 6, 6, 6, 6];
    static giorni = ["Luned&igrave;", "Marted&igrave;", "Mercoled&igrave;", "Gioved&igrave;", "Venerd&igrave;", "Sabato"];
    static CreaDaPagina(arr_testi) {
        var parser = new ParserPagina(arr_testi);
        var nc = new Classe();
        nc.#instestazione = parser.Intestazione;
        nc.#coordinatore = parser.Coordinatore;
        nc.#nome = parser.Nome;
        nc.#orario = parser.Orario;
        nc.#numerostudenti = parser.NumStudenti;
        return nc;
    }

    #nome = "";
    #instestazione = "";
    #coordinatore = "";
    #orario = [[new Materia()]];
    #numerostudenti = 0;

    get Nome() { return this.#nome; }
    get Intestazione() { return this.#instestazione; }
    get Coordinatore() { return this.#coordinatore; }
    get Orario() { return this.#orario; }
    get NumStudenti() { return this.#numerostudenti }
}
class Materia {
    constructor(materia, docente, aula, oraInizio, oraFine) {
        this.#materia = materia;
        this.#docente = docente;
        this.#aula = aula;
        this.#oraInizio = oraInizio;
        this.#oraFine = oraFine;
        this.#nOre = this.OraFine - this.OraInizio + 1;
    }

    #materia = "";
    #docente = "";
    #aula = "";
    #nOre = 0;
    #oraInizio = 0;
    #oraFine = 0;

    get Materia() { return this.#materia; }
    get Docente() { return this.#docente; }
    get Aula() { return this.#aula; }
    get NOre() { return this.#nOre; }
    get OraInizio() { return this.#oraInizio; }
    get OraFine() { return this.#oraFine; }
}
class ParserPagina {
    #arr;

    constructor(arr_testi) {
        this.#arr = arr_testi;
    }

    get Intestazione() {
        return this.#arr[0].str;
    }
    get Nome() {
        return this.Intestazione.split("(")[0].trim();
    }
    get NumStudenti() {
        return parseInt(this.Intestazione.split("(")[1].split(")")[0].trim());
    }
    get Coordinatore() {
        try {
            return this.#arr[2].str.split(":")[1].trim();
        } catch (e) {
            return "";
        }
    }
    get Orario() {
        var a = this.#arr;
        var start = a.findIndex(e => e.str == "13h25") + 2;
        var orario = [[]];
        for (var i = 0; i < Classe.giorni.length; i++) { orario[i] = []; orario[i]["nome"] = Classe.giorni[i]; }
        var sa = "", nc = 0;
        var hinizio = 0, hfine = 10e3;
        var hpos = 0;
        for (var i = start; i < a.length - 3; i++) {
            if (a[i].str == '') {
                sa += ";";
                nc++;
            }
            else {
                if (a[i].transform[5] > hinizio) hinizio = a[i].transform[5];
                if (a[i].transform[5] < hfine) hfine = a[i].transform[5];
                if (a[i].transform[4] > hpos) hpos = a[i].transform[4];
                if (hinizio - hfine < 50)
                    sa += a[i].str + " ";
                else {
                    nc++; i--;
                    hfine = hinizio - 25;
                }
            }
            if (nc >= 3) {
                var spl = sa.split(";");
                var m = new Materia(spl[0].trim(), spl[1].trim(), spl[2].trim(), this.#altezzaToOra(hinizio), this.#altezzaToOra(hfine));
                var igiorno = this.#posizionetogiorno(hpos);
                m.hpos = hpos;
                orario[igiorno].push(m);
                nc = 0;
                sa = "";
                hinizio = 0;
                hpos = 0;
                hfine = 10e3;
            }
        }
        this.#rifinisci(orario);
        return orario;
    }
    #posizionetogiorno(pos) {
        if (pos <= 109) return 0;
        if (pos <= 232) return 1;
        if (pos <= 400) return 2;
        if (pos <= 490) return 3;
        if (pos <= 622) return 4;
        if (pos <= 800) return 5;
        return null;
    }
    #altezzaToOra(altezza) {
        if (altezza >= 427) return 1;
        if (altezza >= 349) return 2;
        if (altezza >= 271) return 3;
        if (altezza >= 192) return 4;
        if (altezza >= 114) return 5;
        if (altezza >= 46) return 6;
        return null;
    }
    #rifinisci(orario = [[new Materia()]]) {
        for (var i = 0; i < orario.length; i++) {
            for (var j = 0; j < orario[i].length; j++) {
                if (orario[i][j + 1] && orario[i][j + 1].OraInizio != orario[i][j].OraFine + 1) {
                    var c = orario[i][j];
                    orario[i][j] = new Materia(c.Materia, c.Docente, c.Aula, c.OraInizio, c.OraFine + 1);
                }
            }
        }
    }
}
var Controls = {}
window.addEventListener("load", function () {
    for (var e of document.querySelectorAll("*[id]")) {
        Controls[e.id] = e;
    }
})