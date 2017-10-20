#include "end_state.h"
#include "world.h"
#include <iostream>
#include "gui.h"
#include "SFGUI/Button.hpp"
#include "build_options.h"
#include "util.h"
#include "SFGUI/Label.hpp"
#include "SFGUI/Window.hpp"
#include "SFGUI/Box.hpp"
#include "SFGUI/Separator.hpp"
#include "play_state.h"
#include "fireworks_entity.h"
#include "particle.h"

StateEnd::StateEnd(World *world) : State(world) {
    fireworkTime = 1.f;
    state = 0;
}

void StateEnd::on_event(sf::Event &event) {
}

sf::Color StateEnd::get_clear_colour() {
    return sf::Color(34, 32, 52);
}

void StateEnd::on_tick() {
    particles_tick(sf::Vector2f(0.f, 0.f));

    if (state == 0) {
        if (timerFirework.getElapsedTime().asSeconds() > fireworkTime) {
            do_fireworks(sf::Vector2f(util::rnd(0.f, (float)WINDOW_WIDTH),
                                      util::rnd(0.f, (float)WINDOW_HEIGHT)),
                         50);
            timerFirework.restart();
            fireworkTime -= .05f;
            if (fireworkTime < .2f)
                fireworkTime = .2f;
        }

        if (timerState.getElapsedTime().asSeconds() > 8.f) {
            state = 1;
            create_gui();
        }
    }

    if (state == 1) {
        if (timerFirework.getElapsedTime().asSeconds() > 1.f) {
            do_fireworks(sf::Vector2f(util::rnd(0.f, (float)WINDOW_WIDTH),
                                      util::rnd(0.f, (float)WINDOW_HEIGHT)),
                         50);
            timerFirework.restart();
        }
    }
}

void StateEnd::on_draw(sf::RenderWindow &window) {
    particles_draw(window, sf::Vector2f(0.f, 0.f));
}

void StateEnd::on_draw_ui(sf::RenderWindow &window) {
}

void StateEnd::create_gui() {
    gui.RemoveAll();
    auto guiButtonSelect = sfg::Button::Create("Back");
    guiButtonSelect->SetId("btnDeathSelect");
    guiButtonSelect->GetSignal(sfg::Button::OnLeftClick).Connect(std::bind([] (void) {
        State::pop_state(); // pop state back to level select
    }));
    guiButtonSelect->SetPosition(sf::Vector2f(WINDOW_WIDTH / 2 - guiButtonSelect->GetRequisition().x / 2.f, 500.f));
    gui.Add(guiButtonSelect);
}

void StateEnd::on_gain_focus() {
    gui.RemoveAll();
    timerFirework.restart();
    timerState.restart();
}

void StateEnd::on_lose_focus() {
}

void StateEnd::on_notify(Event event, void *data) {
}
