"use strict";
let express = 	require("express"),
	app		= 	express(),
	puerto 	= 	process.env.PORT || 8081,
	bodyParser 	= require('body-parser');

//Para indicar que se envía y recibe información por medio de Json...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let encuestas = [{
					id			: 1,
					pregunta    : "¿Qué lenguajes de programación conoce?",
					titulo      : "Lenguajes de programación",
					total       : 0,
					date		: "05/05/2016",
					opciones    : [
									{
										texto : "PHP",
										porcentaje: 0,
										cantidad : 0
									},
									{
										texto : "JavaScript",
										porcentaje: 0,
										cantidad : 0
									},
									{
										texto : "Java",
										porcentaje: 0,
										cantidad : 0
									}
								]
				}];

//Servicios REST...
app.get('/polls', (req, res) =>
{
	//Lista todas las encuestas almacenadas en el array...
	res.json(encuestas);
});

app.post('/createPoll', (req, res) =>
{
	res.json(crearEditar(req.body, 1));
});

app.put('/updatePoll', (req, res) =>
{
	//Actualizar la encuesta y retornar el resultado en un JSON...
	res.json(crearEditar(req.body, 2));
});

app.put('/votePOll', (req, res) =>
{
	res.json(crearEditar(req.body, 3));
	
});

app.delete('/deletePoll/:id', (req, res) =>
{
	var ind = buscarID(req.param("id"));
	if(ind >= 0)
	{
		encuestas.splice(ind, 1);
	}
	res.json({status : ind >= 0 ? true : false});	
});

app.get('/showPoll/:id', (req, res) =>
{
	var ind = buscarID(req.param("id"));
	var devuelve = {datos : ind >= 0 ? encuestas[ind] : "", status : ind >= 0 ? true : false};
	res.json(devuelve);
});

//Para cualquier url que no cumpla la condición...
app.get("*", function(req, res)
{
	res.status(404).send("Página no encontrada :( en el momento");
});

//Función que entrega la posición del array de
//de una encuesta dada el id de la misma...

let buscarID = id =>
{
	let ind = -1;
	for(let i = 0; i < encuestas.length; i++)
	{
		if(Number(encuestas[i].id) === Number(id))
		{
			ind = i;
			break;
		}
	}
	return ind;
};

// Crear una encuesta
let crearEditar = (data, tipo) => 
{
	var indice = 0;
	var date = new Date();
	var fechaActual = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
	var insert =  true;
	//se esta creando una nueva encuesta...
	if(tipo === 1)
	{
		console.log(data.pregunta);
		if (data.pregunta)
		{
			encuestas.push(data);
			indice = encuestas.length - 1;
			encuestas[indice].id = encuestas.length;
			encuestas[indice].date = fechaActual;
		}
		else 
		{
			insert = false;
		}
		
	}
	else if(tipo === 2)
	{
		//Se está editando una encuesta...
		indice = buscarID(data.id); //La posción en el array...
		// console.log(indice, data.id);
		if(indice >= 0)
		{
			encuestas[indice] = data;
			// console.log(data.field);
		}
	}
	else
	{
		let ind 	= buscarID(data.id),
		opcion		= Number(data.opcion);
		encuestas[ind].opciones[opcion - 1].cantidad++;
		encuestas[ind].total++;
		
		for(let i=0;i<encuestas[ind].opciones.length ;i++){
			encuestas[ind].opciones[i].porcentaje = ((encuestas[ind].opciones[i].cantidad)*100)/encuestas[ind].total;
		}
		insert = true;
		// console.log(ind, opcion);
	}
	return {insert : insert , data : insert ? encuestas[indice] : []};
};

app.listen(puerto);
console.log(`Express server iniciado en el ${puerto}`);