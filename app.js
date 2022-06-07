var difficulty=10;
var currentHealth=100;
var movement = 25;
var enemyTime=[];
var rocketTime=[];
var cloudTime=[];
var g;
var c;
var score=0;
var hscore = localStorage.getItem('HighScore', score);

document.querySelector('body').addEventListener('keydown',moveP);
document.querySelector('#Hscore').innerHTML="High Score: " + localStorage.getItem('Highscore');

function moveP(x){
	if (x.keyCode==83){
		moveDown();
	}
	if (x.keyCode==87){
		moveUp();
	}
	if (x.keyCode==68){
		moveRight();
	}
	if (x.keyCode==65){
		moveLeft();
	}
	if (x.keyCode==16) {
		attack();
	}
}

function moveDown(){
		var currentTop = document.querySelector('#player').style.top;
		if (currentTop=='') currentTop=630;
		if (parseInt(currentTop)<=640) {
		document.querySelector('#player').style.top=parseInt(currentTop)+movement+'px';	
	}
}

function moveUp() {
		var currentTop = document.querySelector('#player').style.top;
		if (currentTop=='') currentTop=630;
		if (parseInt(currentTop)>=10) {
		document.querySelector('#player').style.top=parseInt(currentTop)-movement+'px';
	}
}

function moveRight() {
		var currentLeft=document.querySelector('#player').style.left;
		if (currentLeft=='') currentLeft=300;
		if (parseInt(currentLeft)<=620) {
		document.querySelector('#player').style.left=parseInt(currentLeft)+movement+'px';	
	}
}

function moveLeft() {
		var currentLeft=document.querySelector('#player').style.left;
		if (currentLeft=='') currentLeft=300;
		if (parseInt(currentLeft)>=5)
		document.querySelector('#player').style.left=parseInt(currentLeft)-movement+'px';
	}
function attack(){
	var currentTop=parseInt(document.querySelector('#player').style.top)+30;
	var currentLeft=parseInt(document.querySelector('#player').style.left)+25;
	if (document.querySelector('#player').style.left == '') currentLeft=325;
	if (document.querySelector('#player').style.top=='') currentTop=630;
	var rocketID= 'rocket'+Date.now()
	var rocket = document.createElement('img');
	rocket.setAttribute('src','images/rocket1.png');
	rocket.setAttribute('id',rocketID);
	rocket.setAttribute('class','rocket');
	document.querySelector('#rockets').appendChild(rocket);
	document.querySelector('#'+rocketID).style.display='block';
	document.querySelector('#'+rocketID).style.top=currentTop+'px';
	document.querySelector('#'+rocketID).style.left=currentLeft+'px';
	rocketTime[rocketID]=setInterval(function(){
		rTop=parseInt(document.querySelector('#'+rocketID).style.top);
		if (rTop==='') rTop=currentTop;
		document.querySelector('#'+rocketID).style.top=rTop-10+'px';
		hit(rocketID);
		if (rTop<0) {
			clearInterval(rocketTime[rocketID])
			document.querySelector('#'+rocketID).remove()
		}
	},30);
}
function cloud(){
	var cloudStart=700;
	var currentLeft=Math.floor((Math.random()*500));
	var cloudID= 'cloud'+Date.now()
	var cloud= document.createElement('img');
	cloud.setAttribute('src','images/cloud.png');
	cloud.setAttribute('id',cloudID);
	cloud.setAttribute('class','cloud');
	document.querySelector('#clouds').appendChild(cloud);
	document.querySelector('#'+cloudID).style.display='block';
	document.querySelector('#'+cloudID).style.left=currentLeft+'px';
	document.querySelector('#'+cloudID).style.top=cloudStart+'px';
	cloudTime[cloudID]=setInterval(function(){
		cTop=parseInt(document.querySelector('#'+cloudID).style.top);
		document.querySelector('#'+cloudID).style.top=cTop-100+'px';
		if (cTop<-700) {
			clearInterval(cloudTime[cloudID]);
			document.querySelector('#'+cloudID).remove();
		}
	},200);			
}
function enemy(){
	var enemyStart=0;
	var currentLeft=Math.floor((Math.random()*630));
	var enemyID= 'enemy'+Date.now()
	var enemy = document.createElement('img');
	enemy.setAttribute('src','images/enemy1.png');
	enemy.setAttribute('id',enemyID);
	enemy.setAttribute('class','enemy');
	document.querySelector('#enemy').appendChild(enemy);
	document.querySelector('#'+enemyID).style.display='block';
	document.querySelector('#'+enemyID).style.left=currentLeft+'px';
	document.querySelector('#'+enemyID).style.top=enemyStart+ 'px';
	enemyTime[enemyID]=setInterval(function(){
		eTop=parseInt(document.querySelector('#'+enemyID).style.top);
		document.querySelector('#'+enemyID).style.top=eTop+12+'px';
		if (eTop>700) {
			clearInterval(enemyTime[enemyID]);
			document.querySelector('#'+enemyID).remove();
			health();
		}
	},difficulty*10);
}
function easy(){
	difficulty=10;
	g=setInterval(function(){
		enemy()},difficulty*100);
	c=setInterval(function(){
		cloud()},1000);
	document.querySelector('#easy').remove()
	document.querySelector('#hard').remove()
}
function hard(){
	difficulty=5;
	g=setInterval(function(){
		enemy()},difficulty*100);
	c=setInterval(function(){
		cloud()},1000);
	document.querySelector('#easy').remove()
	document.querySelector('#hard').remove()
}
function hit(h){
	var e=document.querySelectorAll('.enemy');
	var rocket=document.querySelector('#'+h);
	for (var i=0; i <e.length; i++){
		var hitL=false;
		var hitT=false;
		if(parseInt(e[i].style.left)<=parseInt(rocket.style.left)&&parseInt(e[i].style.left)+70>=parseInt(rocket.style.left)) 
		hitL=true;	
		if(parseInt(e[i].style.top)<=parseInt(rocket.style.top)&&parseInt(e[i].style.top)+70>=parseInt(rocket.style.top)) 
		hitT=true;	
	if(hitL && hitT){
		score++;
		document.querySelector('#score').innerHTML='Score: ' +score; 
		clearInterval(rocketTime[rocket.getAttribute('id')]);
		clearInterval(enemyTime[e[i].getAttribute('id')]);
		rocket.remove();
		e[i].remove();
	}
}
}

function health(){
	currentHealth=currentHealth-10;
	document.querySelector('#hbar-content').style.width=currentHealth+'%';
	if (currentHealth<=0) gameover();
}

function gameover(){
	document.querySelector('#gameover').style.display='block';
	clearInterval(c);
	clearInterval(g);
	var e=document.querySelectorAll('.enemy');
	for(var i=0; i<e.length; i++){
		clearInterval(enemyTime[e[i].getAttribute('id')]);
	}
	var r=document.querySelectorAll('.rocket');
	for(var i=0; i <r.length; i++){
		clearInterval(rocketTime[r[i].getAttribute('id')]);
	}
	var q=document.querySelectorAll('.cloud');
	for(var i=0; i <q.length; i++){
		clearInterval(cloudTime[q[i].getAttribute('id')]);
	}
	document.querySelector('body').removeEventListener('keydown',moveP);
	if (score>Hscore){
	localStorage.setItem('Highscore', score);
	} localStorage.removeItem('#Hscore');
}