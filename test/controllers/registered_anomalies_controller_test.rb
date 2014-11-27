require 'test_helper'

class RegisteredAnomaliesControllerTest < ActionController::TestCase
  setup do
    @registered_anomaly = registered_anomalies(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:registered_anomalies)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create registered_anomaly" do
    assert_difference('RegisteredAnomaly.count') do
      post :create, registered_anomaly: { anomaly_id: @registered_anomaly.anomaly_id, appointment_id: @registered_anomaly.appointment_id, user_id: @registered_anomaly.user_id }
    end

    assert_redirected_to registered_anomaly_path(assigns(:registered_anomaly))
  end

  test "should show registered_anomaly" do
    get :show, id: @registered_anomaly
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @registered_anomaly
    assert_response :success
  end

  test "should update registered_anomaly" do
    patch :update, id: @registered_anomaly, registered_anomaly: { anomaly_id: @registered_anomaly.anomaly_id, appointment_id: @registered_anomaly.appointment_id, user_id: @registered_anomaly.user_id }
    assert_redirected_to registered_anomaly_path(assigns(:registered_anomaly))
  end

  test "should destroy registered_anomaly" do
    assert_difference('RegisteredAnomaly.count', -1) do
      delete :destroy, id: @registered_anomaly
    end

    assert_redirected_to registered_anomalies_path
  end
end
