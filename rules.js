class Start extends Scene {
    create() {
        localStorage.setItem('grabbedLaptop', 'false'); //makes it so the game can be replaued
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice(this.engine.storyData.InitialLocation);
    }

    handleChoice() {
        this.engine.gotoScene(Location,this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        console.log(key);
        let locationData = this.engine.storyData.Locations[key]; 
        this.engine.show(locationData.Body);
        
        if(locationData.Choices) { 
            for (let choice of locationData.Choices) {
                if (key === "Unit1") {
                    // If the laptop has been grabbed aka the KEY, show the "Open your laptop" choice aka the LOCK
                    if (localStorage.getItem('grabbedLaptop') === 'true' && choice.Nolan) {
                        this.engine.addChoice(choice.Nolan, { Target: choice.Target });
                    } // Do not show "You forgot your laptop" if the laptop has been grabbed this way the story is more fun
                    else if (localStorage.getItem('grabbedLaptop') !== 'true' && choice.Text) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                } else {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);

            // Set a flag in local storage when "Grab the laptop" is chosen
            if (choice.Text === "Grab the laptop") {
                localStorage.setItem('grabbedLaptop', 'true');
            }

            // Set a flag in local storage when visiting "Double Check"
            if (choice.Target === "Double Check") {
                localStorage.setItem('visitedDoubleCheck', 'true');
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');