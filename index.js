import { aboutText } from "./content/about.js";

Vue.createApp({
  data() {
    return {
      activePage: "Travel",
      hoverTravel: false,
      hoverRecall: false,
      hoverDream: false,
      about: aboutText,
      monumentsList: [],

      continents: [
        "Africa",
        "Antarctica",
        "Asia",
        "Australia",
        "Europe",
        "North America",
        "South America",
      ],

      attractionsList: [],

      NewAttraction: {
        name: null,
        country: null,
        continent: "",
        year: null,
        description: "",
        visited: false,
      },
      editedAttraction: {
        id: "",
        name: "",
        country: "",
        continent: "",
        year: "",
        description: "",
        visited: false,
      },
    };
  },
  watch: {
    attractionsList: {
      handler(newValue) {
        localStorage.setItem("attractions", JSON.stringify(newValue));
      },
      deep: true,
    },
  },
  created() {
    const fetchAttractions = async () => {
      const response = await fetch(
        "https://world-wonders-api.org/v0/wonders?lower_limit=-10000&upper_limit=2020&category=SevenModernWonders&sort_by=BuildYear&sort_reverse=false"
      );
      const attractions = await response.json();
      this.monumentsList = attractions;
      console.log(this.monumentsList);
    };
    fetchAttractions();

    const savedAttraction = localStorage.getItem("attractions");
    if (savedAttraction !==null) {
      this.attractionsList = JSON.parse(savedAttraction);
    }
  },
  computed: {
    visitedCount() {
      return this.attractionsList.filter(function (a) {
        return a.visited;
      }).length;
    },
  },
  methods: {
    changeView(newView) {
      this.activePage = newView;
    },
    addAttraction() {
      if (this.NewAttraction.name === null) {
        alert("Name cannot be void!");
        return;
      }

      if (this.NewAttraction.country === null) {
        alert("Country cannot be void!");
        return;
      }

      if (this.NewAttraction.continent === "") {
        alert("Choose a continent!");
        return;
      }
      if (this.NewAttraction.year === null || this.NewAttraction.year <= 0) {
        alert("Place a timestamp!");
        return;
      }
      if (this.NewAttraction.description === "") {
        alert("Give a short description!");
        return;
      }
      if (
        this.NewAttraction.description.length < 75 ||
        this.NewAttraction.description.length > 150
      ) {
        alert(
          "The description must be at least 75 characters cannot exceed 150 characters!"
        );
        return;
      }

      const exists = this.attractionsList.find(
        (attraction) => attraction.name === this.NewAttraction.name
      );
      if (exists) {
        alert("This attraction is already on my list");
        return;
      }

      this.attractionsList.push({
        name: this.NewAttraction.name,
        country: this.NewAttraction.country,
        continent: this.NewAttraction.continent,
        year: this.NewAttraction.year,
        description: this.NewAttraction.description,
        visited: false,
      });

      this.NewAttraction = {
        name: null,
        country: null,
        continent: "",
        year: null,
        description: "",
        visited: null,
      };
    },
    wasVisited(attraction) {
      attraction.visited = !attraction.visited;
    },
    editAttraction(attraction, index) {
      this.editedAttraction = { ...attraction };
      this.editedAttraction.id = index;
    },
    saveAttraction() {
      // let a = { ...this.editedAttraction };
      // delete a.id;
      // console.log(a);
      // this.attractionsList[this.editedAttraction.id] = a;

      const { id, ...withoutId } = this.editedAttraction;
      this.attractionsList[id] = withoutId;

      this.editedAttraction = {
        id: "",
        name: "",
        country: "",
        continent: "",
        year: "",
        description: "",
        visited: false,
      };
    },
  },
}).mount("#app");
