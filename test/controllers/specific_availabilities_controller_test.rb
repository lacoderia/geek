require 'test_helper'

class SpecificAvailabilitiesControllerTest < ActionController::TestCase
  setup do
    @specific_availability = specific_availabilities(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:specific_availabilities)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create specific_availability" do
    assert_difference('SpecificAvailability.count') do
      post :create, specific_availability: { end: @specific_availability.end, start: @specific_availability.start, tutor_id: @specific_availability.tutor_id }
    end

    assert_redirected_to specific_availability_path(assigns(:specific_availability))
  end

  test "should show specific_availability" do
    get :show, id: @specific_availability
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @specific_availability
    assert_response :success
  end

  test "should update specific_availability" do
    patch :update, id: @specific_availability, specific_availability: { end: @specific_availability.end, start: @specific_availability.start, tutor_id: @specific_availability.tutor_id }
    assert_redirected_to specific_availability_path(assigns(:specific_availability))
  end

  test "should destroy specific_availability" do
    assert_difference('SpecificAvailability.count', -1) do
      delete :destroy, id: @specific_availability
    end

    assert_redirected_to specific_availabilities_path
  end
end
