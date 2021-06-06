const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
    box.addEventListener('click', e => {
        console.log("Box : ", e.target.id);
    })
});