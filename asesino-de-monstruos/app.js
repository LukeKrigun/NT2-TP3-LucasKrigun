new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego=true;
            this.saludJugador=100;
            this.saludMonstruo=100;
            this.turnos=[];
        },
        atacar: function () {
            var ataque=this.calcularHeridas(this.rangoAtaque[0],this.rangoAtaque[1]);
            this.saludMonstruo-= ataque;
            this.turnos.unshift({
                esJugador:true,
                text:'El mago ataco al fantasma por '+ ataque + ' puntos.'
            });
            if(this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },
        
        ataqueEspecial: function () {
            var ataqueEspecial = this.calcularHeridas(this.rangoAtaqueEspecial[0],this.rangoAtaqueEspecial[1]);
            this.saludMonstruo-= ataqueEspecial;
            this.turnos.unshift({
                esJugador:true,
                text:'El mago realizo un ataque especial al fantasma por '+ ataqueEspecial + ' puntos.'
            });
            if(this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            var curo=0;
            if(this.saludJugador <=90){
                this.saludJugador+=10;
                curo=10;
            }else{
                curo=100 - this.saludJugador;
                this.saludJugador=100;
            }
            this.turnos.unshift({
                esJugador:true,
                text:'El mago se curo por '+ curo + ' puntos.'
            });
            this.ataqueDelMonstruo();
        },
        
        terminarPartida: function () {
            this.saludJugador=100;
            this.saludMonstruo=100;
            this.turnos=[];
           
            return this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            var ataqueMons=this.calcularHeridas(this.rangoAtaqueDelMonstruo[0],this.rangoAtaqueDelMonstruo[1]);
            this.saludJugador-= ataqueMons;
            this.turnos.unshift({
                esJugador:false,
                text:'El fantasma ataco al mago por '+ ataqueMons + ' puntos.'
            });
            this.verificarGanador();
        },

        calcularHeridas: function (min,max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min)

        },
        verificarGanador: function () {
            var jug = this.saludJugador;
            var mon = this.saludMonstruo;
            if(jug >0 && mon > 0){
                return false;
            }
            else{
                this.terminarPartida();
                this.hayUnaPartidaEnJuego=false;
                if(jug <=0){            
                    if(confirm(`Perdiste por `+ mon +` puntos    \n Queres volver a jugar?`)){
                        this.empezarPartida();
                    }
                }else{
                    if(confirm(`Ganaste por `+ jug +` puntos     \n Queres volver a jugar?`)){
                        this.empezarPartida();
                    }
                }
            return true;
            }
        },

        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});