const parser = new DOMParser();

//localstorage for persist?!
//unnecessary now!

export function relayEvent(event, customType, detail) {
    const relay = event.currentTarget;
    const customEvent = new CustomEvent(customType, {
      bubbles: true,
      detail
    });
  
    relay.dispatchEvent(customEvent);
    event.stopPropagation();
}

function toggleDarkMode(page, checked) {
page.classList.toggle("dark-mode", checked);
}

document.body.addEventListener("dark-mode", (event) =>
toggleDarkMode(
    event.currentTarget,
    event.detail.checked
)
);

window.relayEvent = relayEvent;

