var apiKey = "Put you apiKey";
var centerCoords = [-7.5898, 33.5731];
var initialZoom = 13;
var map = tt.map({
    key: apiKey,
    container: "map",
    center: centerCoords,
    zoom: initialZoom
});

var searchBoxInstance;
var layerFillID = "layerFillID";
var layerOutlineID = "layerOutlineID";
var sourceID = "sourceID";
var styleBase = "tomtom://vector/1/";
var styleS1 = "s1";
var styleRelative = "relative";
var refreshTimeInMillis = 30000
var trafficFlowTilesToggle = document.getElementById("flow-toggle");


var trafficFlowTilesTier = new tt.TrafficFlowTilesTier({
    key: apiKey,
    style: styleBase + styleRelative,
    refresh: refreshTimeInMillis
});

var commonSearchBoxOptions = {
    key: apiKey,
    center: map.getCenter()
};

function toggleTrafficFlowTilesTier() {
    if (trafficFlowTilesToggle.checked) {
        map.addTier(trafficFlowTilesTier);
    } else {
        map.removeTier(trafficFlowTilesTier.getId());
    }
}

function updateSearchBoxOptions() {
    var updatedOptions = Object.assign(commonSearchBoxOptions, {
        center: map.getCenter()
    });
    searchBoxInstance.updateOptions({
        minNumberOfCharacters: 0,
        searchOptions: updatedOptions,
        autocompleteOptions: updatedOptions
    });
}

function onSearchBoxResult(result) {
    map.flyTo({
        center: result.data.result.position,
        speed: 3
    });
}

function initApplication() {
    searchBoxInstance = new tt.plugins.SearchBox(tt.services, {
        minNumberOfCharacters: 0,
        labels: {
            placeholder: "Search"
        },
        noResultsMessage: "No results found.",
        searchOptions: commonSearchBoxOptions,
        autocompleteOptions: commonSearchBoxOptions
    });

    searchBoxInstance.on("tomtom.searchbox.resultselected", onSearchBoxResult);

    document.getElementById("search-panel").append(searchBoxInstance.getSearchBoxHTML());
    trafficFlowTilesToggle.addEventListener("change", toggleTrafficFlowTilesTier);
    document.getElementById("incidents-toggle").addEventListener("change", toggleTrafficIncidentsTier);
    document.getElementById("bounding-box-button").addEventListener("click", enableBoundingBoxDraw);

    map.on("mousedown", onMouseDown);
    map.on("mouseup", onMouseUp);
    map.on("mousemove", onMouseMove);
    map.on("moveend", updateSearchBoxOptions);
}

initApplication();