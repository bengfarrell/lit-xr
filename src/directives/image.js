const images = {};
export default function() {
    return (key, scope) =>
        (part) => {
            if (images[key]) {
                part.setValue(images[key]);
                return;
            }
            const request = new XMLHttpRequest();
            request.open('GET', key, true);
            request.responseType = 'blob';
            request.onload = () => {
                var reader = new FileReader();
                reader.readAsDataURL(request.response);
                reader.onload = e => {
                    images[key] = e.target.result;
                    part.committer.element.setAttribute('src', images[key]);
                    scope.requestUpdate();
                };
            };
            request.send();
            part.setValue(key);
        };
};
