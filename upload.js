const element = (tag, classes=[], content) => {
    const node = document.createElement(tag)
    if (classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }

    return node
}

function noop(){}

export function upload(selector, options = {}) {
    let files = []
    const onUpload = options.onUpload ?? noop
	const input = document.querySelector(selector)
	const preview = element('div', ['preview'])
	const open = element("button", ["btn"], 'Открыть')
	const upload = element("button", ["btn", "primary"], "Загрузить")
    upload.style.display = 'none'

	if (options.multi) {
		input.setAttribute("multiple", true)
	}

	if (options.accept && Array.isArray(options.accept)) {
		input.setAttribute("accept", options.accept.join(","))
	}
    
	input.insertAdjacentElement("afterend", preview)
    input.insertAdjacentElement("afterend", upload)
	input.insertAdjacentElement("afterend", open)

	const triggerInput = () => input.click()

	const changeHandler = (event) => {
		preview.innerHTML = ""
		if (!event.target.files.length) {
			return
		}

		files = Array.from(event.target.files)
        upload.style.display = "inline"

		files.forEach((file) => {
			if (!file.type.match("image")) {
				return
			}

			const reader = new FileReader()

			reader.onload = (ev) => {
				console.log(typeof file.size)
				const mb = (file.size / 1048576).toFixed(2) + " Мб"
				console.log(mb)
				const src = ev.target.result
				preview.insertAdjacentHTML(
					"afterbegin",
					`<div class="preview__image">
                    <div class="preview__remove" data-name="${file.name}">&times;</div>
                    <img src="${src}" alt="${file.name}">
                    <div class="preview__info">
                        <span>${file.name}</span>
                        <span>${mb}</span>
                    </div>
                </div>`
				)
			}

			reader.readAsDataURL(file)
		})
	}

	const removeHandler = (ev) => {
		if (!ev.target.dataset.name) {
			return
		}

		const { name } = ev.target.dataset
		files = files.filter(file => file.name !== name)

        if (!files.length) {
            upload.style.display = "none"
        }

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview__image')
        
        block.classList.add('removing')
        setTimeout(() =>  block.remove(), 300)
       
	}

    const clearPreview = el => {
        el.style.bottom = '4px' //элемент всегда виден
        el.innerHTML = '<div class="preview__info-progress"></div>'
        
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview__remove').forEach(e => e.remove()) //убираем крестики, чтобы не было возможности во время загрузки на сервер удалить картинку из списка files
        const previewInfo = preview.querySelectorAll(".preview__info")
        previewInfo.forEach(clearPreview) //
        onUpload(files)
    }

	open.addEventListener("click", triggerInput)
	input.addEventListener("change", changeHandler)
	preview.addEventListener("click", removeHandler)
	upload.addEventListener("click", uploadHandler)
}
