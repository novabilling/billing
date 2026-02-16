# frozen_string_literal: true

module Novabilling
  module Types
    class PlanPriceResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      field :currency, -> { String }, optional: false, nullable: false
      field :amount, -> { String }, optional: false, nullable: false
      field :is_active, -> { Internal::Types::Boolean }, optional: false, nullable: false, api_name: "isActive"
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
