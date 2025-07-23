import { useState, useEffect, useRef } from "react"

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = useState([])
    const canvasRef = useRef(null)

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])

    function handleChange(event) {
        const { value, name } = event.currentTarget
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }
    
   function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const newMemeUrl = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl
        }))
    }

    function drawMemeOnCanvas() {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        const image = new Image()
        image.crossOrigin = "anonymous"
        image.src = meme.imageUrl

        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(image, 0, 0)
            ctx.font = "40px Impact"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "center"

            ctx.fillText(meme.topText, canvas.width / 2, 50)
            ctx.strokeText(meme.topText, canvas.width / 2, 50)

            ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20)
            ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 20)
        }
    }

    function downloadMeme() {
        drawMemeOnCanvas()
        setTimeout(() => {
            const canvas = canvasRef.current
            const link = document.createElement("a")
            link.download = "your-meme.png"
            link.href = canvas.toDataURL("image/png")
            link.click()
        }, 500)
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>

                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
                <button onClick={downloadMeme}>Download Meme ⬇️</button>
            </div>

            <div className="meme">
                <img src={meme.imageUrl} alt="Meme preview" />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </main>
    )
}
