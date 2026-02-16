# frozen_string_literal: true

module Novabilling
  module Charges
    module Types
      class GetByPlanChargesRequest < Internal::Types::Model
        field :plan_id, -> { String }, optional: false, nullable: false, api_name: "planId"
      end
    end
  end
end
