require 'test_helper'

class AnomaliesControllerTest < ActionController::TestCase
  setup do
    @anomaly = anomalies(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:anomalies)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create anomaly" do
    assert_difference('Anomaly.count') do
      post :create, anomaly: { name: @anomaly.name }
    end

    assert_redirected_to anomaly_path(assigns(:anomaly))
  end

  test "should show anomaly" do
    get :show, id: @anomaly
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @anomaly
    assert_response :success
  end

  test "should update anomaly" do
    patch :update, id: @anomaly, anomaly: { name: @anomaly.name }
    assert_redirected_to anomaly_path(assigns(:anomaly))
  end

  test "should destroy anomaly" do
    assert_difference('Anomaly.count', -1) do
      delete :destroy, id: @anomaly
    end

    assert_redirected_to anomalies_path
  end
end
