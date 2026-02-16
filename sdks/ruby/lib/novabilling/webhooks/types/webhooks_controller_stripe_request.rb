# frozen_string_literal: true

module Novabilling
  module Webhooks
    module Types
      class WebhooksControllerStripeRequest < Internal::Types::Model
        field :stripe_signature, -> { String }, optional: false, nullable: false, api_name: "stripe-signature"
      end
    end
  end
end
