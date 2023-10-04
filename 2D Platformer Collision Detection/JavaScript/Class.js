function Vector(x,y){
	this.x = x;
	this.y = y;
}

function Ray(x,y,dirX,dirY){
	this.pos = new Vector(x,y);
	this.dir = new Vector(dirX,dirY);

	this.show = function(color){
		drawLine(this.pos.x,this.pos.y,
				this.pos.x + this.dir.x,this.pos.y + this.dir.y,2,color);
	}
}

function Rect(x,y,w,h){
	this.pos = new Vector(x,y);
	this.size = new Vector(w,h);
	this.vel = new Vector(0,0);
	this.acc = new Vector(0,0)

	this.show = function(color){
		colorRect(this.pos.x, this.pos.y, this.size.x, this.size.y, color);
	}
}

function Point_In_Rect(point,rect){
	if(point.x >= rect.pos.x && point.x <= rect.pos.x + rect.size.x
	&& point.y >= rect.pos.y && point.y <= rect.pos.y + rect.size.y){
		return true;
	}
	return false;
}

function Rect_In_Rect(rect,target){
	if(rect.pos.x + rect.size.x >= target.pos.x &&
	   rect.pos.x <= target.pos.x + target.size.x &&
	   rect.pos.y + rect.size.y >= target.pos.y &&
	   rect.pos.y <= target.pos.y + target.size.y){
		return true;
	}
	return false;
}

function Ray_In_Rect(ray,rect){
	let t_near = new Vector((rect.pos.x - ray.pos.x)/ray.dir.x,
							(rect.pos.y - ray.pos.y)/ray.dir.y);

	let t_far = new Vector((rect.pos.x + rect.size.x - ray.pos.x)/ray.dir.x,
						   (rect.pos.y + rect.size.y - ray.pos.y)/ray.dir.y)


	if(Math.abs((rect.pos.x - ray.pos.x)/ray.dir.x) == 0 && 
		Math.abs((rect.pos.y - ray.pos.y)/ray.dir.y) == 0){
		return false;
	}
	if(Math.abs((rect.pos.x + rect.size.x - ray.pos.x)/ray.dir.x) == 0 && 
		Math.abs((rect.pos.y + rect.size.y - ray.pos.y)/ray.dir.y) == 0){
		return false;
	}

	if(t_near.x > t_far.x){
		let temp = t_near.x;
		t_near.x = t_far.x;
		t_far.x = temp;
	}
	if(t_near.y > t_far.y){
		let temp = t_near.y;
		t_near.y = t_far.y;
		t_far.y = temp;
	}
	
	if(t_near.x > t_far.y || t_near.y > t_far.x){
		return false;
	}


	let t_hit_near = Math.max(t_near.x,t_near.y);
	let t_hit_far = Math.min(t_far.x,t_far.y);


	if(t_hit_far < 0){
		return false;
	}

	let contactPoint = new Vector(ray.pos.x + t_hit_near*ray.dir.x,
								  ray.pos.y + t_hit_near*ray.dir.y);

	let contactNormal;

	if(t_near.x >= t_near.y){
		if(ray.dir.x < 0){
			contactNormal = new Vector(1,0);
		}else{
			contactNormal = new Vector(-1,0);
		}
	}else if(t_near.x < t_near.y){
		if(ray.dir.y < 0){
			contactNormal = new Vector(0,1);
		}else{
			contactNormal = new Vector(0,-1);
		}
	}


	if(t_hit_near < 1 && t_hit_near > 0){
		// colorCircle(contactPoint.x, contactPoint.y, 10, 'white')
		return {t:t_hit_near,cn:contactNormal,cp:contactPoint};
	}else{
		return false;
	}
}

function dynamicRect_In_Rect(rect,target){
	if(rect.vel.x == 0 && rect.vel.y == 0){
		return false;
	}

	//gets an area for expanded target to hit our player
	let expandedTarget = new Rect(target.pos.x - rect.size.x/2,target.pos.y - rect.size.y/2,
								  target.size.x + rect.size.x,target.size.y + rect.size.y);
	// colorRect(expandedTarget.pos.x, expandedTarget.pos.y, expandedTarget.size.x, expandedTarget.size.y, 'blue')


	//creates ray from rectangle velocity
	let ray = new Ray(rect.pos.x + rect.size.x/2,rect.pos.y + rect.size.y/2,
					rect.vel.x*1.25,rect.vel.y*1.25);

	// ray.show('white');

	let outcome = Ray_In_Rect(ray,expandedTarget);

	if(outcome !== false){
		return outcome;
	}else{
		return false;
	}
}





