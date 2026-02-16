# frozen_string_literal: true

module Novabilling
  module Subscriptions
    module Types
      class ChangePlanDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :new_plan_id, -> { String }, optional: false, nullable: false, api_name: "newPlanId"
        field :prorate, -> { Internal::Types::Boolean }, optional: true, nullable: false
      end
    end
  end
end
