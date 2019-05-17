Rails.application.routes.draw do
  scope '/api' do
    get :food, to: 'foods#index'
    post :food, to: 'foods#create'
  end
end
