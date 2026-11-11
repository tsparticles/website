const r=new Map;class p{addShapeGenerator(e,t){this.getShapeGenerator(e)||r.set(e,t)}getShapeGenerator(e){return r.get(e)}getSupportedShapeGenerators(){return r.keys()}}export{p as ShapeManager};
