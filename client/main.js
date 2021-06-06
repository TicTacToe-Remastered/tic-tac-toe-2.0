const boxes = document.querySelectorAll('.box')

const socket = io('http://localhost:3000')

boxes.forEach(box => {
    box.addEventListener('click', e => {
        console.log("Box : ", e.target.id)
    })
});