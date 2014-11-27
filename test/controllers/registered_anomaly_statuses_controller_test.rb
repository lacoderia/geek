require 'test_helper'

class RegisteredAnomalyStatusesControllerTest < ActionController::TestCase
  setup do
    @registered_anomaly_status = registered_anomaly_statuses(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:registered_anomaly_statuses)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create registered_anomaly_status" do
    assert_difference('RegisteredAnomalyStatus.count') do
      post :create, registered_anomaly_status: { name: @registered_anomaly_status.name }
    end

    assert_redirected_to registered_anomaly_status_path(assigns(:registered_anomaly_status))
  end

  test "should show registered_anomaly_status" do
    get :show, id: @registered_anomaly_status
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @registered_anomaly_status
    assert_response :success
  end

  test "should update registered_anomaly_status" do
    patch :update, id: @registered_anomaly_status, registered_anomaly_status: { name: @registered_anomaly_status.name }
    assert_redirected_to registered_anomaly_status_path(assigns(:registered_anomaly_status))
  end

  test "should destroy registered_anomaly_status" do
    assert_difference('RegisteredAnomalyStatus.count', -1) do
      delete :destroy, id: @registered_anomaly_status
    end

    assert_redirected_to registered_anomaly_statuses_path
  end
end
