import assert from "node:assert/strict";

export async function validateColoringArt(page, art) {
  const parseErrors=[];
  const onConsole=message=>{if(message.type()==="error")parseErrors.push(message.text());};
  page.on("console",onConsole);
  try{
    const failures=await page.evaluate(art=>{
      const failures=[];
      for(const scene of art){
        const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
        document.body.append(svg);
        scene.regions.forEach((region,index)=>{
          const shape=document.createElementNS(svg.namespaceURI,"path");
          shape.setAttribute("d",region.path);
          if(region.transform)shape.setAttribute("transform",region.transform);
          svg.append(shape);
          const bounds=shape.getBBox();
          if(!Number.isFinite(shape.getTotalLength())||shape.getTotalLength()===0||bounds.width===0||bounds.height===0)failures.push(scene.id+":"+index);
        });
        svg.remove();
      }
      return failures;
    },art);
    // Chromium can render the valid prefix of a malformed path. A nonzero
    // length alone is not proof of valid SVG; parser console errors must fail.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    assert.deepEqual(parseErrors,[],"no SVG parser errors in coloring artwork");
    assert.deepEqual(failures,[],"all coloring regions have nonempty geometry");
  }finally{page.off("console",onConsole);}
}
