let projectItems;

export default function (menu, elmlist, itemTags) {
    projectItems = elmlist //save project
  
    let filterlist = Array.from(elmlist)
                    .flatMap(src => {
                        const tags = src.dataset.filtertext?.split(';').map(tag => tag.trim()) ?? []
                        src.dataset.filter = normalizeText(src.dataset.filtertext ?? "")
                        return tags;
                    })
                    .filter((txt, index, flInner) => flInner.findIndex((t) => (normalizeText(t) === normalizeText(txt))) === index)


    for (const text of filterlist) {
        const keyword = normalizeText(text)
        const newListItem = document.createElement("li");
        newListItem.classList.add("nav-item");
        const newBtn = document.createElement("a");
        newBtn.appendChild(document.createTextNode(text))
        newBtn.setAttribute("href", "?search="+keyword)
        newBtn.classList.add("nav-link")
        newBtn.dataset.filter = keyword
        newBtn.addEventListener("click", (e) => {
            e.preventDefault()
            //searchFilter(e.currentTarget, e.currentTarget.dataset.filter)
            searchFilter(newBtn, keyword)
        })
        newListItem.appendChild(newBtn);
        menu.appendChild(newListItem)
    }

    //init from URL
    const parsedParams = new URLSearchParams(window.location.search)
    if (parsedParams.has("search") && parsedParams.get("search") !== "all") {
        const filterbutton = menu.querySelector(`[data-filter="${parsedParams.get("search")}"`)
        if (filterbutton !== null)
            searchFilter(filterbutton, parsedParams.get("search"))
    }
}

const searchFilter = (thisElement, filterValue) => {
    // odznačení aktivního filtru
    for (const liElement of thisElement.parentElement.parentElement.children) {
        liElement.firstElementChild.classList.remove("nav-link--active")
    }

    thisElement.classList.add("nav-link--active")

    // filtrování položek galerie podle data-filter hodnoty
    for (const elm of projectItems) {
        if (elm.dataset.filter?.split(";").find(v => v === filterValue)) {
            elm.parentElement.classList.remove("hide");
        } else {
            elm.parentElement.classList.add("hide");
        }
    }

    const parsedParams = new URLSearchParams(window.location.search)
    parsedParams.set("search", filterValue)
    history.pushState(null, '', window.location.pathname + '?' + parsedParams.toString()); //without redirect
    //window.location.search = parsedParams.toString(); //with redirect
}

function normalizeText(text) {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replaceAll(/\s+/g, "-")
}