class WeatherController < ApplicationController
  def index
    weather_api = Rails.configuration.open_weather_api
  end 
end

