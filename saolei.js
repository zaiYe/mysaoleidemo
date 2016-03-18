	function SaoLei(row,col,n){                        //行，列，雷数
		this.rootEle=document.createElement('div');
			this.rootEle.setAttribute('id', 'saoLei');
			this.rootEle.oncontextmenu=function(){return false;};
		this.grids=[];                                  //格子数组
		this.row=row;                                  
		this.col=col;
		this.leiNum=n;
		this.leiArr=[];
		this.count=0;
		this.win=row*col-n;

		this.init();
	}
	SaoLei.prototype={
		init:function(){
			var self=this;
			this.rootEle.innerHTML='';
			this.rootEle.style.cssText='height:'+this.row*20+'px;width:'+this.col*20+'px;'
			document.body.appendChild(this.rootEle);
			for(var i=0;i<this.row;i++){
				var arr=[];
				for(var k=0;k<this.col;k++){
					var dP=document.createElement('p');
					dP.onmousedown=function(){
						if(!this.flag){
							this.flag=true;
						}
						var pos=self.getPos(this);
						var arr=self.roundGrid(pos.x,pos.y);
						var flag=self.flagNum(arr);
						if(flag[0] == self.getNum(pos.x,pos.y)){
							for(var i=0;i<flag[1].length;i++){
								flag[1][i].getElementsByTagName('span')[0].style.display='none';
								self.count++;
								if(flag[1][i].className=='lei'){
									alert('You lose!');
									return;
								}
							}                                        //循环必须要分开。
							for(var j=0;j<flag[1].length;j++){
								var cPos=self.getPos(flag[1][j]);
							    var x=cPos.x,y=cPos.y;
								if(self.getNum(x,y) == 0){self.bE(x,y);}
								if(self.count == self.win){
									alert('You win!');
								}
							}
							
						}else{
							self.toggleLight(arr,'liang');
						}
					}
					dP.onmouseup=dP.onmousemove=function(){
						if(this.flag){
							var pos=self.getPos(this);
							self.toggleLight(self.roundGrid(pos.x,pos.y),'');
							this.flag=false;
						}
					}
					var dSpan=document.createElement('span');
					dSpan.onmousedown=function(event){
						event.stopPropagation();
						var btnNum=event.button;
						if(btnNum == 2){
							this.classList.toggle('yellow');
						}else if(btnNum == 0){
							if(this.className=='yellow'){
								this.className='';
								return;
							}
							this.style.display='none';
							self.count++;
						    var pos=self.getPos(this);
						    var x=pos.x,y=pos.y;
							if(getParentEle(this).className=='lei'){
								alert('You lose!');
								return;
							}
							if(self.getNum(x,y) == 0){self.bE(x,y);}
						}
						if(self.count == self.win){
							alert('You win!');
						}
					}
					dP.appendChild(dSpan);
					dP.setAttribute('data-num', 0);
					dP.setAttribute('data-pos', i+','+k);
					arr.push(dP);
					this.rootEle.appendChild(dP);
				}
				this.grids.push(arr);
			}
			for(var j=0;j<this.leiNum;j++){
				this.createLei();
			}
		},
		getPos:function(node){
			var pos='';
			var ele= node.nodeName == 'P' ? node: getParentEle(node);
			pos=ele.getAttribute('data-pos').split(',');
			return {x:parseInt(pos[0]),y:parseInt(pos[1])};
		},
		getNum:function(x,y){
			return parseInt(this.grids[x][y].getAttribute('data-num'));
		},
		createLei:function(){
			var x=Math.floor(Math.random()*this.row);
			var y=Math.floor(Math.random()*this.col);
			if(this.grids[x][y].className != 'lei'){
				this.grids[x][y].className = 'lei';
				this.leiArr.push(this.grids[x][y]);
				this.updateNum(x,y);
			}else{
				this.createLei();
			}
		},
		updateNum:function(x,y){
			var roundArr=this.roundGrid(x,y),pos,self=this;
			roundArr.forEach(function(ele,index,arr){
				pos=self.getPos(ele);
				ele.setAttribute('data-num',self.getNum(pos.x,pos.y)+1);
			})
		},
		roundGrid:function(x,y){
			var arr=[],self=this;
			function isInAdd(n,m){
				if(self.inGrid(n,m)){
					arr.push(self.grids[n][m]);
				}
			}
			isInAdd(x-1,y-1);
			isInAdd(x-1,y);
			isInAdd(x-1,y+1);
			isInAdd(x,y-1);
			isInAdd(x,y+1);
			isInAdd(x+1,y-1);
			isInAdd(x+1,y);
			isInAdd(x+1,y+1);
			return arr;
		},
		inGrid:function(x,y){
			return this.grids[x]!= undefined && this.grids[x][y] != undefined;
		},
		bE:function(x,y){                                //蝴蝶效应
			if(!this.bE.cache){this.bE.cache={};}        //利用缓存消除堆栈溢出  赞机智的自己
			if(!this.bE.cache[x+'-'+y]){
				this.bE.cache[x+'-'+y]=1;
			}else{
				return;
			};
			var roundArr=this.roundGrid(x,y),self=this;
			roundArr.forEach(function(ele,index,arr){
				var pos=self.getPos(ele);
				hideSpan(pos.x,pos.y);
			})
			function hideSpan(x,y){
				if(self.inGrid(x,y)){
					if(self.grids[x][y].getElementsByTagName('span')[0].style.display!='none'){
						self.grids[x][y].getElementsByTagName('span')[0].style.display='none';
						self.count++;
					}
					if(self.getNum(x,y) == 0 ){
						self.bE(x,y);
					}
				}
			}
		},
		toggleLight:function(arr,classname){
			arr.forEach(function(ele,index){
				var childSpan=ele.getElementsByTagName('span')[0];
				if(childSpan.style.display != 'none' && childSpan.className != 'yellow'){
					childSpan.className = classname;
				}
			})
		},
		flagNum:function(arr){
			var n=0,arr1=[];
			for(var i=0;i<arr.length;i++){
				if(arr[i].getElementsByTagName('span')[0].className=='yellow'){
					n++;
					continue;
				}
				if(arr[i].getElementsByTagName('span')[0].style.display!='none'){
					arr1.push(arr[i]);
				}
			}
			return [n,arr1];
		}

	}


	function getParentEle(node){
			if(node.parentNode.nodeType == 1 ){
				return node.parentNode;
			}else{
				return getParentEle(node.parentNode);
			}
		}